"""Developer-only SQLAlchemy facts (PF-23, PF-24) against a LOCAL PostgreSQL server.

Usage: python sqlalchemy_facts.py <postgresql+psycopg URL to a maintenance database on a loopback host>
Creates one database, runs the facts, drops it, and prints one JSON line per fact.
"""
import json
import sys
import uuid

from sqlalchemy import ForeignKey, Integer, Numeric, String, bindparam, create_engine, event, select, text
from sqlalchemy.dialects import mssql, postgresql
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, selectinload

url = make_url(sys.argv[1])
if url.host not in ("127.0.0.1", "localhost", "::1"):
    raise SystemExit(f"Refusing non-local host {url.host!r}")


class Base(DeclarativeBase):
    pass


class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    orders: Mapped[list["Order"]] = relationship(back_populates="customer")


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    total: Mapped[float] = mapped_column(Numeric(12, 2))
    customer: Mapped[Customer] = relationship(back_populates="orders")


results = []


def check(fact, fn):
    try:
        results.append({"id": fact, "status": "PASS", "note": fn() or ""})
    except Exception as e:  # noqa: BLE001 - every failure is reported, never hidden
        results.append({"id": fact, "status": "FAIL", "note": f"{type(e).__name__}: {e}"})


name = f"chayen_py_{uuid.uuid4().hex}"
admin = create_engine(url, isolation_level="AUTOCOMMIT")
with admin.connect() as c:
    c.execute(text(f"CREATE DATABASE {name}"))
engine = create_engine(url.set(database=name))
try:
    Base.metadata.create_all(engine)
    with Session(engine) as s:
        s.add_all([Customer(id=i, name=f"c{i}", orders=[Order(id=i * 10 + j, total=j) for j in range(3)]) for i in range(1, 6)])
        s.commit()

    def pf23():
        q = select(Customer.id).where(Customer.name.ilike("%C1%")).order_by(Customer.id).limit(5).offset(10)
        pg = str(q.compile(dialect=postgresql.dialect()))
        ms = str(q.compile(dialect=mssql.dialect()))
        assert "LIMIT" in pg and "OFFSET" in pg and "ILIKE" in pg, pg
        assert "LIMIT" not in ms and "ILIKE" not in ms and ("FETCH" in ms or "ROW_NUMBER" in ms), ms
        ms_form = "OFFSET/FETCH" if "FETCH" in ms else "ROW_NUMBER() (no server version known at compile time)"
        stmt = insert(Customer).values(id=1, name="renamed")
        stmt = stmt.on_conflict_do_update(index_elements=[Customer.id], set_={"name": stmt.excluded.name})
        assert "ON CONFLICT (id) DO UPDATE" in str(stmt.compile(dialect=postgresql.dialect()))
        payload = "' OR 1=1 --"
        with engine.begin() as c:
            c.execute(stmt)
            assert c.execute(select(Customer.name).where(Customer.id == 1)).scalar_one() == "renamed"
            bound = c.execute(text("SELECT count(*) FROM customers WHERE name = :n").bindparams(bindparam("n", payload))).scalar_one()
            concatenated = c.execute(text(f"SELECT count(*) FROM customers WHERE name = '{payload}'")).scalar_one()
        assert bound == 0 and concatenated == 5, (bound, concatenated)
        return f"same Core query: PostgreSQL LIMIT/OFFSET/ILIKE vs SQL Server {ms_form} with lower() LIKE; on_conflict_do_update upserts; bound parameter 0 rows vs f-string 5 rows"

    def pf24():
        statements = []
        listener = lambda *a: statements.append(a[2])  # noqa: E731
        event.listen(engine, "before_cursor_execute", listener)
        try:
            with Session(engine) as s:
                for cust in s.scalars(select(Customer)).all():
                    _ = [o.total for o in cust.orders]          # lazy load: one query per customer
            lazy = len(statements)
            statements.clear()
            with Session(engine) as s:
                for cust in s.scalars(select(Customer).options(selectinload(Customer.orders))).all():
                    _ = [o.total for o in cust.orders]
            eager = len(statements)
        finally:
            event.remove(engine, "before_cursor_execute", listener)
        assert lazy == 6 and eager == 2, (lazy, eager)
        return f"5 customers: lazy loading {lazy} statements, selectinload {eager}"

    check("PF-23", pf23)
    check("PF-24", pf24)
finally:
    engine.dispose()
    with admin.connect() as c:
        c.execute(text(f"DROP DATABASE IF EXISTS {name} WITH (FORCE)"))
    admin.dispose()

for r in results:
    print(json.dumps(r))
