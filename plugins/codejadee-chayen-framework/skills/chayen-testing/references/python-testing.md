---
kind: technology
---
# Python testing: pytest, unittest, Django

**Applies to:** Python 3 projects.

- Identify pytest configuration (`[tool.pytest.ini_options]`,
  `pytest.ini`, `conftest.py`).
- Identify plugins (`pytest-asyncio`, `pytest-django`, `pytest-mock`), or
  plain `unittest`.

## Check the repository first

| Area | What to look for |
|---|---|
| Runner | pytest (most common), `unittest`, Django `manage.py test` |
| Fixtures | `conftest.py` fixtures, factories (factory_boy), builders |
| Mocks | `unittest.mock`, `pytest-mock` (`mocker`), `monkeypatch`, `respx` / `responses` for HTTP |
| Async | `pytest-asyncio` mode (`asyncio_mode` in config), `anyio` |
| Layout | `tests/` mirroring the package, or co-located `test_*.py`. Naming `test_<behavior>`. |

## Writing tests

- **Use plain `assert` with pytest.** Use `pytest.raises(...)` for
  exceptions, with `match=` only when the message is part of the contract.
- **Data-driven cases:** `@pytest.mark.parametrize` for input and expected
  tables, with readable `ids`.
- **Fixtures:**
  - reuse existing fixtures before creating new ones;
  - keep their scope as narrow as possible;
  - use `tmp_path` for files.
- **Control time and randomness:** inject a clock, or use the project's
  freezing tool. Seed or inject random generators.
- **Patch where the name is looked up,** for example
  `mocker.patch("app.services.orders.send_email")`, not where it is
  defined.

## Web frameworks

- **FastAPI.**
  - Use `TestClient(app)`, or httpx `AsyncClient` with the project's
    transport setup.
  - Override dependencies with `app.dependency_overrides`, and clear them
    after each test.
- **Django.** Use `TestCase` or pytest-django (`@pytest.mark.django_db`,
  `client`, `rf`).
  - Assert status codes, response JSON, and permissions.
- **Authorization:** test anonymous, forbidden, and allowed requests for
  protected endpoints.

## Commands

Run through the project's environment tool (`uv run`, `poetry run`, or an
activated virtualenv):

```bash
pytest -q
pytest tests/test_invoices.py -k parse_invoice -q
pytest -q -p no:randomly          # only if pytest-randomly is installed and order matters for diagnosis
pytest --count=50 -k flaky_test   # only if pytest-repeat is installed
```

## Pitfalls

- Tests that depend on execution order, or on module-level state.
- Real network calls in unit tests.
- Over-broad `except` blocks in tests that hide failures.
- Leaving `dependency_overrides`, or monkeypatched globals, in place across
  tests.
