import { Widget } from "../models/widget.model";

export const widgets: Widget[] = [
    {
        id: "manageCase",
        href: null,
        isExtended: false,
        title: "Manage Your Cases",
        description: "Submit cases and track progress",
        routerLink: 'manage-case',
        icon: "d-icon-list_check"
    },
    {
        id: "askCommunity",
        href: null,
        isExtended: false,
        title: "Ask The Community",
        description: "Share insights, solve problems...",
        routerLink: 'community',
        icon: "d-icon-users"
    },
    {
        id: "prdDownloads",
        href: null,
        isExtended: false,
        title: "Product Downloads",
        description: "Find the latest product downloads...",
        routerLink: "epd-widget",
        icon: "d-icon-download"
    },
    {
        id: "docs",
        href: null,
        isExtended: false,
        title: "Documentation",
        description: "Access online technical documentation",
        routerLink: 'docs',
        icon: "d-icon-file_text_o"
    },
    {
        id: "prdSupport",
        href: null,
        isExtended: false,
        title: "Product Support",
        description: "Everything you need on one page.",
        routerLink: null,
        icon: "d-icon-laptop_server_search"

    },
    {
        id: "training",
        href: null,
        isExtended: false,
        title: "Get Training",
        description: "Choose among role specific training...",
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
        icon: "d-icon-puzzle"

    },
    {
        id: "supportedProducts",
        href: null,
        isExtended: false,
        title: "Supported Products",
        description: "Find product support status, dates...",
        routerLink: null,
        icon: "d-icon-case_wrench"
    },
    {
        id: "supportVideos",
        href: null,
        isExtended: false,
        title: "Support Videos",
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
        routerLink: null,
        icon: "d-icon-service_desk"
    },
    {
        id: "supportQuestions",
        href: null,
        isExtended: false,
        title: "Common Support Questions",
        description: "See frequently asked questions",
        routerLink: 'support-question',
        icon: "d-icon-question_circle_o"
    }
]