chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ mode: 'block' })
})

chrome.storage.local.get(['mode'], (result) => {
    updateRules(result.mode ?? 'block')
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_MODE') {
        chrome.storage.local.set({ mode: message.payload }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                updateRules(message.payload);
                sendResponse({ success: true });
            }
        });
        return true;
    }
});

function updateRules(mode: string) {
    if (mode === 'off') {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1, 2, 3]
        })
        return
    }

    const rules = [
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

    if (mode === 'redirect') {
        rules.push({
            id: 3,
            priority: 3,
            action: {
                type: 'redirect' as chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                redirect: {
                    url: 'https://www.facebook.com'
                }
            } as chrome.declarativeNetRequest.RuleAction,
            condition: {
                urlFilter: '*',
                resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
            }
        })
    }

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3],
        addRules: rules
    })
}
