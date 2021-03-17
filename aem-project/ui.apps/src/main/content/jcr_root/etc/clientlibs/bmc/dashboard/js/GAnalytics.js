document.querySelectorAll('.psc-orientation-checklist > div.psc-fs-12 a').forEach(function (item) { 
    item.addEventListener('click', function (event) {
        console.log(item);
        gtag('event', 'click', {
            'event_category': item.innerText,
            'event_label': 'page-bottom'
        })
    }) 
})

document.querySelectorAll('.psc-news .news-block a').forEach(function (item) { 
    item.addEventListener('click', function (event) {
        console.log(item);
        gtag('event', 'click', {
            'event_category': item.innerText,
            'event_label': 'news article'
        })
    }) 
})

var newUser = document.querySelector('#newUser a');
    if (newUser) {
        newUser.addEventListener('click', function (event) {
            gtag('event', 'click', {
                'event_category': 'onboarding',
                'event_label': 'page-top'
            })
    })
}

var feedback = document.querySelector('#feedbackTab');
if (feedback) {
    feedback.addEventListener('click', function (event) {
        gtag('event', 'click', {
            'event_category': 'feedback',
            'event_label': 'support activity'
        })
    })
}

var chat = document.querySelector('.support-chat-now');
if (chat) {
    chat.addEventListener('click', function (event) {
        gtag('event', 'click', {
            'event_category': 'chat',
            'event_label': 'support activity'
        })
    })
}
