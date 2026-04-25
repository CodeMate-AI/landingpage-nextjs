// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanPrice {
    monthly: number
    yearly: number
}

export interface PlanAccess {
    chat: boolean
    context: {
        git: boolean
        commits: boolean
        docs: boolean
        codebase: { local: boolean; cloud: boolean; current: boolean }
    }
    modes: { eco: boolean; normal: boolean; pro: boolean }
    internet_search: boolean
    byok: boolean
    access_tokens: boolean
    code_evaluation: boolean
}

export interface PlanLimits {
    image: number
    internet_search: number
    rot: number
    cloud_kb: number
    autocomplete: number
    local_kb: number
    rpd: number
    access: PlanAccess
}

export interface Plan {
    _id: string
    type: string
    plan_id: string
    display_name: string
    price: PlanPrice
    limits: PlanLimits
    product: string[]
}

export interface CategorizedPlans {
    build: Plan[]
    c0: Plan[]
    cora: Plan[]
    ultimatePlan?: Plan
}

// ─── Feature header type ──────────────────────────────────────────────────────
// Controls what renders above the feature list in PlanCard:
//   "INCLUDES"             → "INCLUDES" label only (base / standalone tiers)
//   "INCLUDES_WITH_PARENT" → "Everything in Teams, plus" (enterprise)
//   null                   → "Everything in <parent>, plus" (inheriting tiers)
export type FeaturesHeader = 'INCLUDES' | 'INCLUDES_WITH_PARENT' | null

// ─── Static feature data ──────────────────────────────────────────────────────

const BUILD_FEATURES: Record<string, string[]> = {
    pro: [
        '200 requests per day',
        'Unlimited image uploads and processing',
        'Figma-to-code conversion',
        'Document (PDF, DOC, TXT, DOCX) Support',
        'Instant deployment with shareable links',
        'Source code download capability',
    ],
    max: ['400 requests per day'],
    teams: ['400 requests per day', 'Voice Input Support', 'Custom Domain'],
    enterprise: [
        'Dedicated account manager',
        'Custom integrations',
        'SLA & priority support',
        'Advanced security & compliance',
        'Custom billing options',
    ],
}

const C0_FEATURES: Record<string, string[]> = {
    hobby: ['Chat access', 'Local knowledge base'],
    pro: [
        '10 cloud knowledge bases',
        'Unlimited autocomplete',
        'Unlimited internet searches',
        'Code evaluation',
    ],
    teams: ['25 cloud knowledge bases'],
    enterprise: [
        'Unlimited cloud knowledge bases',
        'Unlimited code evaluations/month',
        'Dedicated account manager',
        'Custom integrations',
        'SLA & priority support',
        'Advanced security & compliance',
    ],
}

// Pro and hobby are standalone (no "Everything in Free, plus").
// Enterprise always shows "Everything in Teams, plus".
const BUILD_HEADER: Record<string, FeaturesHeader> = {
    pro:        'INCLUDES',
    max:        null,
    teams:      null,
    enterprise: 'INCLUDES_WITH_PARENT',
}

const C0_HEADER: Record<string, FeaturesHeader> = {
    hobby:      'INCLUDES',
    pro:        'INCLUDES',
    teams:      null,
    enterprise: 'INCLUDES_WITH_PARENT',
}

// Plans allowed through the category filter
const ALLOWED_PLAN_NAMES = new Set([
    'pro', 'pro plus', 'teams', 'enterprise', 'codemate max',
])

// ─── API ──────────────────────────────────────────────────────────────────────

export async function fetchPlans(): Promise<Plan[]> {
    const response = await fetch('https://backend.v3.codemate.ai/v2/plans', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    })
    if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

// ─── Categorization ───────────────────────────────────────────────────────────

export function categorizePlansByProduct(plans: any[]): CategorizedPlans {
    const categorized: CategorizedPlans = { build: [], c0: [], cora: [] }

    // Resolve license plan limits
    const resolved = plans.map((plan) => {
        const licenseId = plan.available_licenses?.[0]?.license_id
        if (licenseId) {
            const licensePlan = plans.find((p) => p.plan_id === licenseId)
            if (licensePlan) plan.limits = licensePlan.limits
        }
        return plan
    })

    // Strip child license plans
    const filtered = resolved.filter((plan) => !plan?.parent_license_id)

    for (const plan of filtered) {
        const name = plan.display_name.toLowerCase()

        if (plan.is_ultimate || name === 'codemate max') {
            categorized.ultimatePlan = plan
        }

        const isCoraMax = name === 'max' && plan.product.includes('cora')
        const isAllowed = plan.is_ultimate || isCoraMax || ALLOWED_PLAN_NAMES.has(name)
        if (!isAllowed) continue

        for (const product of plan.product) {
            const key = product.toLowerCase() as 'build' | 'c0' | 'cora'
            if (!['build', 'c0', 'cora'].includes(key)) continue
            if (!categorized[key].find((p) => p._id === plan._id)) {
                categorized[key].push(plan)
            }
        }
    }

    return categorized
}

export async function fetchAndCategorizePlans(): Promise<CategorizedPlans> {
    const plans = await fetchPlans()
    return categorizePlansByProduct(plans)
}

// ─── Plan conversion ──────────────────────────────────────────────────────────

export function convertToPlanInfo(plan: any, isRecommended = false) {
    const key = plan.display_name.toLowerCase()
    const isBuild = plan.product.includes('build')
    const isC0 = plan.product.some((p: string) => p.toLowerCase() === 'c0')

    const features = isBuild
        ? (BUILD_FEATURES[key] ?? [])
        : isC0
        ? (C0_FEATURES[key] ?? [])
        : extractFeatures(plan)

    const featuresHeader: FeaturesHeader = isBuild
        ? (BUILD_HEADER[key] ?? null)
        : isC0
        ? (C0_HEADER[key] ?? null)
        : null

    return {
        id: plan._id,
        name: plan.display_name,
        title: plan.display_name,
        description: `For ${plan.type} users`,
        monthlyPrice: plan.price.monthly.toString(),
        yearlyPrice: plan.price.yearly.toString(),
        currency: 'USD',
        highlight: isRecommended,
        features,
        featuresHeader,
        monthlyCtaText: 'Get Started',
        monthlyCtaLink: plan.stripe_id?.monthly ?? '#',
        yearlyCtaText: 'Get Started',
        yearlyCtaLink: plan.stripe_id?.yearly ?? '#',
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractFeatures(plan: Plan): string[] {
    const features: string[] = []
    const { limits } = plan

    if (limits?.internet_search === -1)       features.push('Unlimited internet searches')
    else if (limits?.internet_search > 0)     features.push(`${limits.internet_search} internet searches`)

    if (limits?.cloud_kb === -1)              features.push('Unlimited cloud knowledge base')
    else if (limits?.cloud_kb > 0)            features.push(`${limits.cloud_kb} cloud KB storage`)

    if (limits?.autocomplete === -1)          features.push('Unlimited autocomplete')
    else if (limits?.autocomplete > 0)        features.push(`${limits.autocomplete} autocomplete suggestions`)

    if (limits?.access?.chat)                 features.push('Chat access')
    if (limits?.access?.context?.codebase?.cloud) features.push('Knowledge Base')
    if (limits?.access?.code_evaluation)      features.push('Code Evaluation')
    if (limits?.access?.modes?.pro)           features.push('Pro mode access')

    return features
}

export function formatLimitValue(value: number | undefined, unit = ''): string {
    if (value === undefined || value === null) return 'N/A'
    if (value === -1) return 'Unlimited'
    const formatted = value.toLocaleString()
    return unit ? `${formatted}${unit}` : formatted
}