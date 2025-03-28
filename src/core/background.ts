chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true })
})

chrome.storage.local.get(['enabled'], (result) => {
    updateRules(result.enabled ?? true)
})

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOGGLE_FILTER') {
        chrome.storage.local.set({ enabled: message.payload })
        updateRules(message.payload)
    }
})

function updateRules(enable: boolean) {
    if (enable) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2],
            addRules: [
                {
                    id: 1,
                    priority: 1,
                    action: {
                        type: 'block'
                    },
                    condition: {
                        urlFilter: '*',
                        resourceTypes: ['main_frame']
                    }
                },
                {
                    id: 2,
                    priority: 2,
                    action: {
                        type: 'allow'
                    },
                    condition: {
                        urlFilter: 'facebook.com',
                        resourceTypes: ['main_frame']
                    }
                }
            ]
        })
    } else {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2]
        })
    }
}
