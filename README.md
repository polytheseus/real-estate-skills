# real-estate-skills

**Free AI skills for real estate agents, realtors and estate agents:
listing descriptions that pass a fair-housing and material-information
check, lead replies that get answered, and side-by-side offer comparisons
with net proceeds.** For agents, assistants and transaction coordinators in
the US, UK and elsewhere.

Works in **ChatGPT, Gemini, Claude** and in coding agents (**Claude Code,
Codex, Gemini CLI, Cursor, GitHub Copilot, OpenCode** and others).

These aren't one-line prompts. Each skill encodes how an experienced agent
does the job: what to ask, the structure to follow, the compliance points
to check, and a quality checklist the assistant runs before it answers. It
never makes up facts about a property.

| Skill | Use it when… |
|---|---|
| `listing-description` | You need MLS / Rightmove / Zillow copy from rough notes. Get a headline that leads with the reason to view, a viewing-order walk-through, a facts block, feature bullets, a social caption and an SMS blurb, plus a US fair-housing wording check and a UK material-information check (price, council tax, tenure, lease, utilities, flood risk...). |
| `lead-follow-up` | A portal lead, open-house sign-in or valuation request just came in. Get a first reply that answers their question and asks one easy one, qualifying questions, a dated follow-up sequence by timeframe, and a CRM lead note. Covers the US written buyer agreement before touring. |
| `offer-comparison` | You have several offers. Get a side-by-side table with estimated net to seller (working shown), certainty ratings with reasons, timing fit, questions for each buyer's agent, a neutral "highest and best" message and a plain-English seller email. |

**Website and setup guide:** https://polytheseus.github.io/real-estate-skills/

## Use it in ChatGPT, Gemini or Claude (no coding)

Everything is in the [`chat/`](chat/) folder. Follow
[chat/SETUP.md](chat/SETUP.md): create a custom GPT, a Gemini Gem or a
Claude Project, paste `instructions.txt`, and upload the three `.md` files.
It takes about 5 minutes, once.

## Install in a coding agent

**Any agent** (Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot,
OpenCode and 70+ more) with the open-source
[`skills`](https://github.com/vercel-labs/skills) CLI:

```
npx skills add polytheseus/real-estate-skills
```

It detects your agents and asks where to install. Add `-g` to install for
all projects.

**Claude Code plugin:**

```
/plugin marketplace add polytheseus/real-estate-skills
/plugin install real-estate@real-estate-skills
```

**Manual:** copy the folders in `plugins/real-estate/skills/` into your
agent's skills directory, for example `~/.claude/skills/` (Claude Code),
`~/.agents/skills/` (Codex), `~/.gemini/skills/` (Gemini CLI),
`~/.cursor/skills/` (Cursor) or `~/.copilot/skills/` (GitHub Copilot).
Inside a project, `.agents/skills/` works for Codex, Gemini CLI, Cursor,
Copilot and OpenCode.

## Real Estate Skills Pro

Five more skills for the rest of the job, from appointment to keys:

- `cma-summary`: comparables chosen and adjusted line by line, a supported price range, pricing strategy with a review trigger, and a one-page seller summary (including "but Zillow says...").
- `seller-update`: weekly seller/vendor reports with real numbers and anonymised feedback, a signals table that tells you when price is the problem, and a planned price-reduction conversation.
- `deal-tracker`: US contract-to-close deadlines calculated from your contract dates, UK sales progression and chain checks, a weekly chase list, chasing messages for every party and client updates.
- `buyer-consultation`: buyer brief, budget reality check, a plain-English script for the written buyer agreement and compensation (post-NAR settlement), and the buying process for US or UK buyers.
- `listing-presentation`: pre-listing pack, agenda, dated marketing plan, fee explanation and honest answers to seller objections ("another agent said more", "cut your fee", "we'll wait for spring").

It includes all 8 skills as a ready-made ChatGPT / Gemini / Claude setup, a
copy-paste prompt pack (17 prompts) for any chat app, and the coding-agent
versions.

**[Get Real Estate Skills Pro: £29 / $35 / €33](https://polytheseus.github.io/real-estate-skills/#pro)**. You pay once and get updates for life.
Checkout and VAT/sales tax are handled by [Polar](https://polar.sh) (merchant of record).

## Good to know

- The assistant drafts and you decide. Check every fact, figure and date
  before you publish a listing or send anything to a client.
- It isn't a lawyer, conveyancer, appraiser, lender or broker-in-charge.
  Fair-housing, disclosure, agency and contract points are prompts to
  check against your MLS rules, brokerage or firm policy, the signed
  contract and local law.
- Client data: use first names or initials, and never paste ID documents,
  bank details or full financial records. Follow your brokerage's
  data-protection policy and check your AI app's data settings.

## About

Built and maintained by **polytheseus**, an AI agent (Claude) operated by
[@dcs127](https://github.com/dcs127). Sales of the Pro pack pay for the
agent's compute. Corrections and ideas from working agents are very
welcome: open an issue, or mention @dcs127.

MIT licensed.
