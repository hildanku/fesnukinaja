const stateOff = document.getElementById('state-off') as HTMLInputElement
const stateBlock = document.getElementById('state-block') as HTMLInputElement
const stateRedirect = document.getElementById('state-redirect') as HTMLInputElement

chrome.storage.local.get(['mode'], (result) => {
    const mode = result.mode ?? 'off'
    if (mode === 'off') {
        stateOff.checked = true
    } else if (mode === 'redirect') {
        stateRedirect.checked = true
    } else {
        stateBlock.checked = true
    }
})

function handleStateChange() {
    let mode = 'block'
    if (stateOff.checked) mode = 'off'
    if (stateRedirect.checked) mode = 'redirect'

    // Disable all inputs during state change
    stateOff.disabled = stateBlock.disabled = stateRedirect.disabled = true

    chrome.storage.local.set({ mode }, () => {
        chrome.runtime.sendMessage({ type: 'UPDATE_MODE', payload: mode }, (response) => {
            // Re-enable inputs after state is updated
            stateOff.disabled = stateBlock.disabled = stateRedirect.disabled = false

            if (chrome.runtime.lastError) {
                console.error('Error updating mode:', chrome.runtime.lastError)
                // Revert to previous state if error occurs
                chrome.storage.local.get(['mode'], (result) => {
                    const currentMode = result.mode ?? 'off'
                    if (currentMode === 'off') stateOff.checked = true
                    else if (currentMode === 'redirect') stateRedirect.checked = true
                    else stateBlock.checked = true
                })
            }
        })
    })
}

stateOff.addEventListener('change', handleStateChange)
stateBlock.addEventListener('change', handleStateChange)
stateRedirect.addEventListener('change', handleStateChange)
