# Verification routing — from Confirmation to executing check

The engine: every Confirmation format maps onto an executable check almost 1:1. Route each
criterion BEFORE writing any check; a criterion that fits no route is a refinement defect —
release the story (`building` → `ready`) and bounce to a refine-story revisit session, naming
the line. Never invent a weaker check to make a criterion fit.

| Confirmation format | Executable check |
| --- | --- |
| Checklist rule | Unit or integration test asserting the customer-visible outcome |
| Example table | **Parameterized test — the rows verbatim as cases** (the 3–7 rows with boundary + counter-example are the fixture; `[InlineData]` / `test.each` per stack) |
| Given-When-Then | Arrange/act/assert with exactly **one act**; Givens = setup, Thens = assertions |
| Scalar + Meter | **Instrumentation obligation, not a test**: implement the measurement hook the Meter names; report it as instrumented-not-yet-proven. An optional smoke check is allowed; a faked perf assertion is not |
| Sketch pointer | Human walkthrough item at gate #2 — never auto-passed |

## The two-way trace (load-bearing)

The business→test translation is where fidelity leaks — a test quietly asserting something
weaker than its criterion. So the trace runs both directions, and both are checked at review:

- **Every criterion** has at least one executing check (or a walkthrough/instrumentation entry
  for the last two routes).
- **Every new check** names its criterion — in its name (`S07_AC2_…` or the stack's tagging
  idiom) and in the plan's trace table.

## Guru-Checks-Output, applied to tests

Assertions state expected values up front. "No error thrown", "result is defined", or
re-deriving the expectation from the code under test is never a criterion's whole proof. The
example table's rows are the expected values — use them verbatim, boundary and counter-example
included.

## Naming

Checks carry story + criterion: `S07_AC2_rejects_expired_token` (test-name idiom) or the
stack's tagging equivalent. A reviewer must be able to run the trace from the check list alone.
