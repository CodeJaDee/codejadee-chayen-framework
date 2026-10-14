# Python web APIs: FastAPI, Django / Django REST framework, Flask

**Applies to:** Python 3 web services.

- Check the Python version (`requires-python`, `.python-version`) and the
  framework versions before using version-specific APIs.
- For example, Pydantic v1 and v2 differ significantly.

## Check the repository first

| Area | What to look for |
|---|---|
| Framework | `fastapi`, `django` + `djangorestframework`, `flask` |
| Environment tool | uv (`uv.lock`), Poetry (`poetry.lock`), pip + `requirements*.txt`. Run commands through it. |
| Structure | FastAPI `APIRouter` modules, Django apps (`views.py`, `serializers.py`, `urls.py`), Flask blueprints |
| Data access | SQLAlchemy (sync or async), Django ORM, Alembic, raw drivers (`psycopg`, `asyncpg`, `pyodbc`) |
| Lint and type tools | Ruff, Black, mypy, pyright. Look in `pyproject.toml`. |

## FastAPI

- **Models.** Request and response models are Pydantic models. Declare
  `response_model` (or a return annotation) so internal fields are not
  returned.
- **Pydantic v2:** `model_validate`, `field_validator`, `model_config`.
- **Pydantic v1:** `parse_obj`, `validator`, `class Config`. Match the
  installed version.
- **Dependencies.** Use `Depends` for sessions, current user, and settings,
  reusing the existing dependency functions.
- **Errors.** Raise `HTTPException(status_code=..., detail=...)`, or use the
  project's exception handlers.
- **Async.**
  - Use `async def` handlers only with non-blocking I/O.
  - Blocking drivers belong in `def` handlers, which run in a threadpool.

## Django and DRF

- **Validate at the boundary.**
  - DRF: serializers (`is_valid(raise_exception=True)`).
  - Plain Django: forms.
- **Querysets.** Use them for data access. Use `select_related` and
  `prefetch_related` to avoid N+1.
- **Raw SQL** goes through `cursor.execute(sql, params)` with parameters,
  never string formatting.
- **Migrations:** `python manage.py makemigrations`, then review, then
  `migrate` (approval required for shared databases).
- **Permissions** come from DRF permission classes or decorators, matching
  existing views.

## Flask

- **Blueprints** follow the project's structure.
- **Validation:** marshmallow, pydantic, or the existing helper.
- **Errors:** `abort()` / error handlers that return a consistent JSON shape.

## Verification commands

Run through the project's environment tool:

```bash
pytest -q
ruff check .        # if configured
mypy .              # if configured
```

- **FastAPI:** test with `TestClient` (or httpx `AsyncClient`), following
  the existing tests.
- **Django:** `python manage.py test`, or pytest-django if configured.

## Pitfalls

- Using mutable default arguments in models or functions.
- Returning ORM objects without a schema or serializer, which leaks fields.
- Running blocking calls inside `async def` handlers.
- Committing `.env` files, or printing settings that contain secrets.
