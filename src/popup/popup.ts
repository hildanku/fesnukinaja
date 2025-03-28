const toggle = document.getElementById('toggle') as HTMLInputElement

chrome.storage.local.get(['enabled'], (result) => {
    toggle.checked = result.enabled ?? true
})

toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked })
    chrome.runtime.sendMessage({ type: 'TOGGLE_FILTER', payload: toggle.checked })
})
