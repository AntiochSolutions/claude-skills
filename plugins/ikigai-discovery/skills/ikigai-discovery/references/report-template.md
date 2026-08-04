# Ikigai Report Generation Template

When the subject is ready for their report, generate a professional Word document (.docx) using the docx skill. Read the docx SKILL.md at `/mnt/skills/public/docx/SKILL.md` before generating.

## Pre-Report Checklist

Before generating, confirm you have:
- [ ] Specific findings for all four circles (not vague summaries)
- [ ] At least one detailed peak performance example with actions and outcomes
- [ ] 3-5 recurring patterns identified across circles
- [ ] A validated Ikigai statement
- [ ] An honest assessment of any current opportunity (if applicable)
- [ ] Subject has reviewed the synthesis verbally and confirmed/corrected it
- [ ] Any private details marked "not for the report" have been excluded

## Report Structure

### Title Page
- "PERSONAL IKIGAI" (subtitle label)
- "Discovery Report" (main title)
- "A Rigorous Self-Examination of Purpose, Talent, Need, and Value"
- Date prepared
- "Facilitated through structured Ikigai interview"

### Section 1: What Is Ikigai?
Brief explanation of the framework (2-3 paragraphs). Include the Ikigai Venn diagram — generate an SVG with four overlapping circles showing:
- What you Love (top-left)
- What you can be Paid For (top-right)
- What you're Good At (bottom-left)
- What the World Needs (bottom-right)
- Intersections: Passion, Profession, Vocation, Mission
- Shadows of each partial intersection (delight but no wealth, etc.)
- Center: IKIGAI

Convert the SVG to PNG using cairosvg for embedding in the docx. Follow with explanatory text about the intersections and shadows.

### Section 2: Circle One — What You Love
- **Surface Finding:** What they said initially
- **Deeper Finding:** What emerged under scrutiny, with evidence table
- **Any special subsections** (e.g., abandoned passions, deferred loves) — include the honest challenge AND the nuanced resolution

### Section 3: Circle Two — What You're Good At
- **Self-Assessment vs. Market Validation:** How well these align
- **Validated Strengths:** Evidence table with specific examples
- **Career Arc** (if relevant): How their trajectory validates the findings
- **The Critical Nuance:** Any conditional activation pattern
- **The Gap:** Where enjoyment and excellence diverge

### Section 4: Circle Three — What the World Needs
- **Their Conviction:** The visceral answer, framed as moral conviction not market observation
- **The Differentiation Challenge:** What they see that others in their space don't — highlight the structural insight in a callout box
- **Specific Impact:** Concrete example of the transformation they create

### Section 5: Circle Four — What You Can Be Paid For
- **Proven Revenue Streams:** Where money has already flowed voluntarily
- **Financial Targets:** Table format
- **Market Thesis Under Scrutiny:** Honest challenge of their income strategy

### Section 6: Your Ikigai — The Center
- **The Ikigai Statement:** In a prominent callout box, gold/warm background
- **Why This Formulation:** Explain how it maps to all four circles (use an alignment table)
- **The Scaling Insight** (if applicable): Path from current state to long-term vision

### Section 7: Current Opportunity Assessment (if applicable)
- **Alignment Assessment:** How the opportunity maps to the Ikigai
- **Strengths of the Fit:** Evidence table
- **Risks and Open Questions:** Honest concerns in a red-header table
- Only include this section if the subject discussed a specific venture/role

### Section 8: Key Tensions to Monitor
Two-column table of tensions and descriptions. Frame as "design constraints to manage, not problems to solve." Include all recurring patterns that surfaced across circles.

### Section 9: Recommended Immediate Priorities
Numbered priorities in order of importance. Each priority gets a bold title and explanatory paragraph. These should be actionable, specific, and grounded in the Ikigai findings.

### Closing: A Final Note
Short reflection on Ikigai as compass rather than destination. End with a personalized statement that captures the subject's core pattern in italicized prose.

## Design Specifications

### Color Palette
| Element | Color |
|---|---|
| Navy (headings, emphasis) | #1B2A4A |
| Teal (section borders, accents) | #2E8B8B |
| Warm Gold (highlight boxes, dividers) | #C5943A |
| Light Teal (callout backgrounds) | #E8F4F4 |
| Light Gold (Ikigai statement box) | #FDF6E9 |
| Light Navy (table shading) | #EEF1F6 |
| Red (risk tables) | #B04040 |

### Typography
- Headings: Georgia, navy
- Body: Calibri, 11pt, dark text (#2C2C2C)
- Section headers: 16pt bold with teal bottom border
- Subheaders: 13pt bold teal

### Formatting Rules
- Use tables for evidence, not bullet lists
- Callout boxes (borderless tables with background fill) for key insights
- Page breaks before major sections
- Header: "Ikigai Discovery Report" (italicized, teal)
- Footer: "Confidential | Page [n]" (centered)

## Writing Voice

The report should read as a synthesis by a rigorous but respectful analyst. Key characteristics:

- **Third person perspective** — "You described..." not "I think you..."
- **Evidence-based claims** — Every finding should trace back to something the subject said
- **Honest challenges preserved** — Include the tensions and counter-arguments, not just the flattering findings
- **Direct language** — "This is not a weakness — it is a design constraint" over "Perhaps this could be considered an area for growth"
- **No corporate platitudes** — If something is a risk, call it a risk. If a strategy has holes, name them.

## Also Offer

After generating the report, offer to create:
1. A concise `.md` operating reference (decision filter, not the full report) for ongoing use
2. Memory edits to save key facts across conversations

These are separate deliverables from the report.
