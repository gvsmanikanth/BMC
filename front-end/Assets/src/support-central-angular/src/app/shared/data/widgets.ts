import { Widget } from "../models/widget.model";

export const widgets: Widget[] = [
    {
        id: "manageCase",
        href: null,
        isExtended: false,
        title: "Case Management",
        description: "Submit cases and track progress",
        routerLink: 'manage-case',
        icon: "psc-icon-case_management"
    },
    {
        id: "askCommunity",
        href: null,
        isExtended: false,
        title: "Community",
        description: "Blogs, questions, discussions and ideas",
        routerLink: 'community',
        icon: "psc-icon-community"
    },
    {
        id: "prdDownloads",
        href: null,
        isExtended: false,
        title: "Product Downloads",
        description: "Latest product downloads, patches & installation tools",
        routerLink: "epd-widget",
        icon: "psc-icon-downloads"
    },
    {
        id: "docs",
        href: null,
        isExtended: false,
        title: "Documentation",
        description: "Online technical documentation",
        routerLink: 'docs',
        icon: "psc-icon-documentation"
    },
    {
        id: "prdSupport",
        href: null,
        isExtended: false,
        title: "Product Support",
        description: "Everything you need on one page",
        routerLink: null,
        icon: "psc-icon-product_support"

    },
    {
        id: "training",
        href: null,
        isExtended: false,
        title: "Training & Certification",
        description: "Choose among role specific training",
        routerLink: null,
        icon: "psc-icon-training_cartification"
    },
    {
        id: "prdCompatibility",
        href: null,
        isExtended: false,
        title: "Product Compatibility",
        description: "Check product compatibility with platforms and databases",
        routerLink: null,
        icon: "psc-icon-product_compatibility"

    },
    {
        id: "supportedProducts",
        href: null,
        isExtended: false,
        title: "Product Catalog",
        description: "Product support status and lifecycle dates",
        routerLink: null,
        icon: "psc-icon-product_catalog"
    },
    {
        id: "supportVideos",
        href: null,
        isExtended: false,
        title: "How-to Videos",
        description: "YouTube support channels",
        routerLink: null,
        icon: "psc-icon-how_to_videos"
    },
    {
        id: "servicesConsulting",
        href: null,
        isExtended: false,
        title: "Services and Consulting",
        description: "Get help with all aspects of your digital journey",
        routerLink: 'sac',
        icon: "psc-icon-services_consulting"
    },
    {
        id: "supportQuestionUrl",
        href: null,
        isExtended: false,
        title: "Common Support Questions",
        description: "Frequently asked questions",
        routerLink: 'support-question',
        icon: "psc-icon-faq",
        personalized: true
    }
]