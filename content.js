
// NOTE: We are using vars everywhere since this script can called multiple times
// will result in re-declaration errors if used const/let

// a unique ID to prevent multiple instantiations
var EXTENSION_ID = "netflix-party-better-chat"

// The current state of the chat sidebar
var hidden = false

// the main netflix div
var target = document.querySelector('.nf-kb-nav-wrapper')

// gets the chat 
var getChat = () => {
  return target.querySelector('#chat-wrapper')
}

// gets the player window
var getPlayer = () => {
  return target.querySelector('.sizing-wrapper')
}

// create the collapse button
// right now we create an extra container incase we wanna do stuff with it
var createCollapseButton = (chat) => {
  let collapseButton = document.createElement('div')
  collapseButton.classList = ['collapse-btn']
  collapseButton.appendChild(document.createTextNode("›"))

  let collapseButtonContainer = document.createElement('div')
  collapseButtonContainer.classList = ['collapse-btn-container']
  collapseButtonContainer.appendChild(collapseButton)

  return { button: collapseButton, container: collapseButtonContainer }
}


// Initializes the Better Chat
var InitializePlus = () => {
  console.log('Netflix Party Better Chat: Initialized');
  let chat = getChat()
  let player = getPlayer()

  // create container + button
  const { button, container } = createCollapseButton(chat)
  chat.appendChild(container)

  var timeout = null

  // collapse button on click
  // @param {Boolean} hiddenVal the hiddenvalue we want to set
  const onClick = (hiddenVal) => {

    // Add 'no-chat' / 'has-chat' based on hidden
    if (hiddenVal) {
      chat.classList.remove('has-chat')
      chat.classList.add('no-chat')
      player.classList.remove('has-chat')
      player.classList.add('no-chat')
    } else {
      chat.classList.remove('no-chat')
      chat.classList.add('has-chat')
      player.classList.remove('no-chat')
      player.classList.add('has-chat')
    }

    // delay the > / < change to make it look better
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      button.innerHTML = hiddenVal ? '‹' : '›'
    }, 400)
    hidden = hiddenVal
  }
  button.addEventListener('click', () => onClick(!hidden))

  // initialize button
  onClick(hidden)

  // add unique ID to mark that we have initalized
  const unique = document.createElement('div')
  unique.id = EXTENSION_ID
  target.appendChild(unique)


  /**
   * watch the inactive window for fading away the chat show
   * The reason we do this is so that the "open chat" bar is only
   * visible when the standard netflix overlay is visible
   * This is an easy solution that just uses observers
   */
  // init the watcher for inactive window
  const inactiveWindow = document.querySelector('.nfp.nf-player-container')

  // observe the window, if active then we activate, else deactivate
  let inactiveObserver = new MutationObserver(() => {
    let classlist = inactiveWindow.classList

    // add the active/inactive class to reflect this
    if (classlist.contains('active')) {
      container.classList.add('active')
      container.classList.remove('inactive')
    } else {
      container.classList.add('inactive')
      container.classList.remove('active')
    }
  })
  inactiveObserver.observe(inactiveWindow, { attributes: true });
}



/**
 * If this page has netflix party (denoted by having "target")
 */
if (target) {
  // We observe the target netflix div to check if netflix party has been enabled
  // this only triggers once when the netflix party gets enabled
  let observer = new MutationObserver(() => {

    // checks if netflix party has been enabled via chrome extension
    const chat = getChat()

    // check if we already have added the divs
    const exists = !!document.querySelector('#' + EXTENSION_ID)

    if (chat && !exists) {
      InitializePlus()
    }
  }
  );
  observer.observe(target, { childList: true });
}