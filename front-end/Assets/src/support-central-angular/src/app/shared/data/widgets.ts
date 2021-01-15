import { Widget } from "../models/widget.model";

export const widgets: Widget[] = [
    {
        id: "manageCase",
        href: null,
        isExtended: false,
        title: "Case Management",
        description: "Submit cases and track progress",
        routerLink: 'manage-case',
        icon: "d-icon-toolbox"
    },
    {
        id: "askCommunity",
        href: null,
        isExtended: false,
        title: "Community",
        description: "Blogs, questions, discussions and ideas",
        routerLink: 'community',
        icon: "d-icon-users"
    },
    {
        id: "prdDownloads",
        href: null,
        isExtended: false,
        title: "Product Downloads",
        description: "Latest product downloads, patches & installation tools",
        routerLink: "epd-widget",
        icon: "d-icon-download"
    },
    {
        id: "docs",
        href: null,
        isExtended: false,
        title: "Documentation",
        description: "Online technical documentation",
        routerLink: 'docs',
        icon: "d-icon-file_text_o"
    },
    {
        id: "prdSupport",
        href: null,
        isExtended: false,
        title: "Product Support",
        description: "Everything you need on one page",
        routerLink: null,
        icon: "d-icon-wrench"

    },
    {
        id: "training",
        href: null,
        isExtended: false,
        title: "Training & Certification",
        description: "Choose among role specific training",
        routerLink: null,
        icon: "d-icon-training_room"
    },
    {
        id: "prdCompatibility",
        href: null,
        isExtended: false,
        title: "Product Compatibility",
        description: "Check product compatibility with platforms and databases",
        routerLink: null,
        icon: "psc-icon-compatibility_modeler"

    },
    {
        id: "supportedProducts",
        href: null,
        isExtended: false,
        title: "Product Catalog",
        description: "Product support status and lifecycle dates",
        routerLink: null,
        icon: "psc-icon-az_listing"
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
        icon: "d-icon-hands_gear"
    },
    {
        id: "supportQuestionUrl",
        href: null,
        isExtended: false,
        title: "Common Support Questions",
        description: "Frequently asked questions",
        routerLink: 'support-question',
        icon: "d-icon-question_circle_o"
    }
]