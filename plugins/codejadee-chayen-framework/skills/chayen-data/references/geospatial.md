---
kind: recipe
capabilities: [CAP-19-007]
---
# Geospatial data

Store and query geospatial data correctly: spatial types with an explicit
SRID, geography for distances on the earth's surface, spatial indexes,
distance and containment queries, and tests with known coordinates. Map
display concerns (coordinate order, projections) are handled at the
boundary.

## Inputs

- The spatial questions: nearest, within a radius, inside an area, route
  or area calculations.
- The engine and whether spatial support is installed (PostGIS, SQL Server
  spatial types), and the ORM's spatial support.
- Data sources and their coordinate systems, and the precision needed.

## Procedure

1. **Inspect support:** PostGIS installed (`SELECT extname, extversion FROM
   pg_extension WHERE extname = 'postgis';`), SQL Server `geography` and
   `geometry` types (built in), and ORM spatial packages (NetTopologySuite,
   GeoAlchemy2, GeoDjango). Installing an extension is an approved schema
   change, never assumed.
2. **Choose types and SRID:** geography (SRID 4326) for distances in metres
   on the earth's surface; geometry with a projected SRID only for local,
   planar work. State the choice per column.
3. **Fix the coordinate order:** WGS 84 longitude, latitude in WKT and most
   database functions, while many APIs and UIs use latitude, longitude.
   Convert at the boundary, and test it.
4. **Index:** a spatial index (GiST on PostGIS, spatial index on SQL
   Server) on columns used in distance or containment filters.
5. **Write queries** with index-friendly predicates: `ST_DWithin` on
   geography or `STDistance` with a bounding filter, `ST_Contains` or
   `STContains`, and nearest-neighbour ordering supported by the index.
6. **Validate data:** valid shapes (`ST_IsValid`, `STIsValid`), correct
   ring orientation for SQL Server geography polygons, and coordinates in
   range.
7. **Test with known coordinates:** distances checked against reference
   values within a tolerance, the nearest store for a known point, and
   points inside and outside a polygon.

## Outputs

- A schema with spatial types and indexes, and query implementations.
- Tests with known coordinates and expected results.

## Technology considerations

| Stack | Consideration |
|---|---|
| PostgreSQL and PostGIS | `geography(Point, 4326)`, `ST_DWithin`, `ST_Distance`, `<->` KNN ordering with GiST indexes, `ST_Transform` for projections. |
| SQL Server | `geography` and `geometry` types, `STDistance`, `STIntersects`, spatial indexes with bounding boxes for geometry, polygon ring orientation rules for geography. |
| .NET | EF Core with NetTopologySuite (`UseNetTopologySuite`), `Point` coordinates as (X = longitude, Y = latitude), SRID set on every geometry. |
| Python | GeoAlchemy2 with SQLAlchemy, GeoDjango, Shapely for in-memory geometry, pyproj for transformations. |
| Frontends | Map libraries (Leaflet, MapLibre, Google Maps) expect latitude and longitude in different orders; convert in one place. |

## Verification

- The distance query returns the known nearest fixture store, using
  geography (not planar geometry) for distances in metres.
- Coordinate order is tested at the boundary with a known point.
- Spatial support was found installed, or enabling it is listed as an
  approved migration step.
