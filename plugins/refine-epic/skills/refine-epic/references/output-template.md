# Output — canonical model, tracker field-mapping, and markdown brief

One **canonical internal model** captured in the interview, rendered for the team two ways: (1) a
structured object you can hand back or map into whatever backlog tool they use, and (2) a standalone
markdown brief. Same content, two renderers. This skill needs **no API and no credentials** — it
produces the definition; a human applies it wherever they track epics.

---

## Canonical model (what the interview produces)
```
{
  title:                     string   // business-language noun phrase (drafted last)
  description:               string   // plain narrative: problem today + proposed change
  benefitHypothesis:         string   // falsifiable: belief -> benefit -> confirming/killing evidence
  businessOutcomes:          string   // measurable, lagging (number + unit + direction; baseline->target)
  leadingIndicators:         string   // early + predictive signals, incl. the kill signal
  nonFunctionalRequirements: string   // quantified quality constraints (ISO-25010 categories that apply)
  outOfScope:                string   // explicit "not this time" boundaries + deferred candidates
  openMeasurements:          string[] // metrics that should exist but don't yet (honest interview output)
}
```
`openMeasurements` is NOT an epic field — surface it in the report + the markdown so the team knows what
to instrument. Do not fabricate numbers to avoid listing one here.

---

## Mapping to a backlog tool (optional)
If the team tracks epics somewhere, map the canonical properties onto that tool's fields. There's no
universal schema, so use the description fields where a dedicated field doesn't exist (most tools have a
title + a rich-text body; many have custom fields you can repurpose):

| Canonical property | Where it usually goes |
|---|---|
| title | Epic title / summary |
| description | Epic description / body |
| benefitHypothesis | A "Benefit Hypothesis" custom field, or a labelled section in the body |
| businessOutcomes | A "Business Outcomes" / "Success Metrics" field, or a body section |
| leadingIndicators | A "Leading Indicators" field, or a body section |
| nonFunctionalRequirements | An "NFRs" field, or a body section |
| outOfScope | An "Out of Scope" field, or a body section |

Tool notes:
- **Jira** — Epic Summary + Description; add custom fields for the value chain, or use the description
  with the headings from the markdown brief below.
- **Azure DevOps** — Epic Title + Description; "Business Value" is a number, not this narrative, so keep
  the chain in the description or custom fields.
- **Linear / GitHub** — title + markdown body; paste the brief directly.

Do **not** set prioritization scores (WSJF, business value points, priority) or split the epic into
features/stories — that's a separate, human-owned step. This skill defines the epic itself.

If there's no tool to write to, just hand over the markdown brief.

---

## Markdown brief template
```markdown
# Epic: <Title>

## Description
<plain narrative: how it works today + what's painful + the proposed change>

## Benefit Hypothesis
We believe **<change>** will produce **<benefit>** for **<whom>**.
We'll know we're right when **<confirming evidence>**, and wrong if **<killing evidence>**.

## Business Outcomes (lagging — 6–12 months)
- <metric>: <baseline> → <target>
- ...

## Leading Indicators (early — weeks; predictive)
- Go: <early signal that predicts the outcome>
- Stop / kill: <early signal that says pull the plug>

## Non-Functional Requirements (quantified)
- <ISO-25010 category>: <quantified constraint>
- ...

## Out-of-Scope
- <explicitly excluded / deferred item>
- ...

## Open measurements to establish
- <metric the team should instrument but doesn't track yet>
- ...

---
_Value chain check: Benefit → Outcomes → Leading Indicators validated (each link confirmed with the SME)._
```

The closing chain-check line is a real assertion — only include it once you've actually validated the
three links in dialog (per `interview-guide.md`). If a link is still open, say so instead.
