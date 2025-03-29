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
                        type: chrome.declarativeNetRequest.RuleActionType.BLOCK
                    },
                    condition: {
                        urlFilter: '*',
                        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
                    }
                },
                {
                    id: 2,
                    priority: 2,
                    action: {
                        type: chrome.declarativeNetRequest.RuleActionType.ALLOW
                    },
                    condition: {
                        urlFilter: 'facebook.com',
                        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
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
