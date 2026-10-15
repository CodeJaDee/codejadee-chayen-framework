"""Import-only: every SQLAlchemy API listed in the "Driver references" table of
skills/chayen-data/references/postgres-data-access.md is referenced here, so importing this
module proves each name resolves against the pinned packages (DR-02, DR-03). Nothing connects."""
import psycopg
from sqlalchemy import Numeric, bindparam, create_engine, event, select, text
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP, insert
from sqlalchemy.orm import Session, selectinload

REFERENCED = [create_engine, select, text, bindparam, event, Numeric, JSONB, TIMESTAMP, insert, Session, selectinload, psycopg.connect]
