# Verification
Local development instance, real PostgreSQL, Chromium.

- Automated Node tests: scoring, validation, learning gates and preference recovery.
- API tests: transaction roundtrip, notes, dates, ownership isolation, export, watchlist, settings, deletion, cross-origin rejection, three-viewer aggregate gate and opt-out.
- Interactive browser journeys: complete quiz → save → reload; interrupted draft recovery; spoiler reveal; literal script text safely escaped; director search; watchlist filter; custom film; mobile quiz and settings; self-contained preview save/reload.
- Desktop 1440px and mobile 390px screenshots inspected. Intentional page/modal scrolling is supported. Motion respects reduced-motion preferences.

Recommendation accuracy is not validated by these engineering tests; synthetic recovery only verifies the baseline implementation. Public deployment and production authentication were not performed.

Catalogue update: verified 9,742 imported source films and aggregate count of 100,836 historical ratings in real PostgreSQL. Catalogue search, literal wildcard handling, genre filtering and immediate first-review metadata picks are covered by automated tests. No source users or aspect scores are fabricated. MovieLens restrictions are preserved in the package.

The expanded test suite has 16 passing tests. Browser checks verified first review → 8 picks in both the live PostgreSQL app and the standalone preview; movie search, genre selection, page bounds, refresh persistence and no horizontal mobile overflow. Personal browser storage does not duplicate the catalogue.
