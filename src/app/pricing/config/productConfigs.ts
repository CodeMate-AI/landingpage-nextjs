import { ProductConfig } from '../types/planBuilder'

/**
 * Build Product Configuration
 * Base value: $0.2 per credit
 */
export const buildConfig: ProductConfig = {
    name: 'build',
    displayName: 'Build',
    color: '#3b82f6', // Blue
    features: [
        {
            key: 'credits',
            title: 'Credits',
            type: 'range',
            base: {
                value: 0.2, // $0.2 per credit
                worth: 1, // 1 credit
            },
            min: 100,
            max: 5000,
            step: 50,
            defaultValue: 500,
            unit: 'credits',
        },
        // {
        //     key: 'imageSupport',
        //     title: 'Image Support',
        //     type: 'boolean',
        //     base: {
        //         value: 25, // Fixed $25 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Enable image processing capabilities',
        // },
        // {
        //     key: 'prioritySupport',
        //     title: 'Priority Support',
        //     type: 'boolean',
        //     base: {
        //         value: 50, // Fixed $50 when enabled
        //     },
        //     defaultValue: false,
        //     description: '24/7 dedicated support with faster response times',
        // },
        // {
        //     key: 'apiAccess',
        //     title: 'API Access',
        //     type: 'boolean',
        //     base: {
        //         value: 30, // Fixed $30 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Integrate with third-party tools via secure API',
        // },
    ],
}

/**
 * C0 Product Configuration
 * Base value: $0.15 per credit (cheaper than Build)
 */
export const c0Config: ProductConfig = {
    name: 'c0',
    displayName: 'C0',
    color: '#8b5cf6', // Purple
    features: [
        {
            key: 'rpm',
            title: 'Requests',
            type: 'range',
            base: {
                value: 0.15, // $0.15 per credit
                worth: 1,
            },
            min: 100,
            max: 5000,
            step: 50,
            defaultValue: 500,
            unit: '',
        },
        {
            key: 'cepm',
            title: 'Code Evaluations',
            type: 'range',
            base: {
                value: 0.15, // $0.15 per credit
                worth: 1,
            },
            min: 100,
            max: 5000,
            step: 50,
            defaultValue: 500,
            unit: '',
        },
        {
            key: 'cloud_kb',
            title: 'Knowledge Base',
            type: 'range',
            base: {
                value: 0.15, // $0.15 per credit
                worth: 1,
            },
            min: 100,
            max: 5000,
            step: 50,
            defaultValue: 500,
            unit: '',
        },
        // {
        //     key: 'advancedAnalytics',
        //     title: 'Advanced Analytics',
        //     type: 'boolean',
        //     base: {
        //         value: 40, // Fixed $40 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Advanced data insights and customizable dashboards',
        // },
        // {
        //     key: 'teamCollaboration',
        //     title: 'Team Collaboration',
        //     type: 'boolean',
        //     base: {
        //         value: 35, // Fixed $35 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Real-time collaboration features for team projects',
        // },
        // {
        //     key: 'customBranding',
        //     title: 'Custom Branding',
        //     type: 'boolean',
        //     base: {
        //         value: 20, // Fixed $20 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Add your logo and colors to the platform interface',
        // },
    ],
}

/**
 * Cora Product Configuration
 * Base value: $0.25 per credit (premium pricing)
 */
export const coraConfig: ProductConfig = {
    name: 'cora',
    displayName: 'Cora',
    color: '#ec4899', // Pink
    features: [
        {
            key: 'credits',
            title: 'Credits',
            type: 'range',
            base: {
                value: 0.2, // $0.25 per credit
                worth: 1,
            },
            min: 100,
            max: 5000,
            step: 5,
            defaultValue: 500,
            unit: 'credits',
        },
        // {
        //     key: 'aiAssistant',
        //     title: 'AI Assistant',
        //     type: 'boolean',
        //     base: {
        //         value: 60, // Fixed $60 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Advanced AI-powered assistance and automation',
        // },
        // {
        //     key: 'offlineAccess',
        //     title: 'Offline Access',
        //     type: 'boolean',
        //     base: {
        //         value: 25, // Fixed $25 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Work offline with automatic syncing when reconnected',
        // },
        // {
        //     key: 'advancedSecurity',
        //     title: 'Advanced Security',
        //     type: 'boolean',
        //     base: {
        //         value: 45, // Fixed $45 when enabled
        //     },
        //     defaultValue: false,
        //     description: 'Enhanced encryption and multi-factor authentication',
        // },
    ],
}

/**
 * All product configurations
 */
export const allProductConfigs = [buildConfig, c0Config, coraConfig]
