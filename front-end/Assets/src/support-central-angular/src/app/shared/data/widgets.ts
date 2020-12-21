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
        description: "",
        routerLink: "epd-widget",
        icon: "d-icon-download"
    },
    {
        id: "docs",
        href: null,
        isExtended: false,
        title: "Documentation",
        description: "",
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
        title: "Architecture Compatibility Modeler",
        description: "Check if your products are supported",
        routerLink: null,
        icon: "d-icon-monitor_gear_puzzle"

    },
    {
        id: "supportedProducts",
        href: null,
        isExtended: false,
        title: "Product Catalog",
        description: "Product support status and lifecycle dates",
        routerLink: null,
        icon: "d-icon-case_wrench"
    },
    {
        id: "supportVideos",
        href: null,
        isExtended: false,
        title: "How-to Videos",
        description: "View support video solutions",
        routerLink: null,
        icon: "d-icon-right-attachment_video_adapt"
    },
    {
        id: "servicesConsulting",
        href: null,
        isExtended: false,
        title: "Services & Consulting",
        description: "Get help with all aspects of your digital journey",
        routerLink: 'sac',
        icon: "d-icon-hands_gear"
    },
    {
        id: "supportQuestionUrl",
        href: null,
        isExtended: false,
        title: "Frequently Asked Questions",
        description: "See frequently asked questions",
        routerLink: 'support-question',
        icon: "d-icon-question_circle_o"
    }
]