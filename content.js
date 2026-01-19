/* global hideRules */

(function () {
  const hideElement = (element) => {
    element.style.display = 'none'
  }

  const hideByClass = (className) => {
    const elements = document.querySelectorAll(`.${className}`)
    elements.forEach(hideElement)
  }

  const hideByHref = (keyword) => {
    const links = document.querySelectorAll(`a[href*="${keyword}"]`)
    links.forEach(hideElement)
  }

  const hideByContent = (selector, keyword) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      if (el.textContent && el.textContent.toLowerCase().includes(keyword.toLowerCase())) {
        hideElement(el)
      }
    })
  }

  const hideByTitle = (selector, keyword) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      if (el.title && el.title.toLowerCase().includes(keyword.toLowerCase())) {
        hideElement(el)
      }
    })
  }

  const hideByAttribute = (attr, value) => {
    const elements = document.querySelectorAll(`[${attr}="${value}"]`)
    elements.forEach(hideElement)
  }

  const applyHideRule = (rule) => {
    if (rule.type === 'class') {
      hideByClass(rule.value)
    } else if (rule.type === 'href') {
      hideByHref(rule.value)
    } else if (rule.type === 'content') {
      hideByContent(rule.selector, rule.value)
    } else if (rule.type === 'title') {
      hideByTitle(rule.selector, rule.value)
    } else if (rule.type === 'attribute') {
      hideByAttribute(rule.attr, rule.value)
    }
  }

  const matchesRule = (node, rule) => {
    if (rule.type === 'class') {
      return node.classList.contains(rule.value)
    } else if (rule.type === 'href') {
      return node.tagName === 'A' && node.href.includes(rule.value)
    } else if (rule.type === 'content') {
      return node.tagName.toUpperCase() === rule.selector.toUpperCase() && node.textContent && node.textContent.toLowerCase().includes(rule.value.toLowerCase())
    } else if (rule.type === 'title') {
      return node.tagName.toUpperCase() === rule.selector.toUpperCase() && node.title && node.title.toLowerCase().includes(rule.value.toLowerCase())
    } else if (rule.type === 'attribute') {
      return node.getAttribute(rule.attr) === rule.value
    }
    return false
  }

  const shouldHideNode = (node) => {
    return hideRules.some(rule => matchesRule(node, rule))
  }

  const hideElementsInNode = (node) => {
    if (shouldHideNode(node)) {
      hideElement(node)
    }
    // Descendants
    hideRules.forEach(rule => {
      if (rule.type === 'class') {
        const descendants = node.querySelectorAll(`.${rule.value}`)
        descendants.forEach(hideElement)
      } else if (rule.type === 'href') {
        const linkDescendants = node.querySelectorAll(`a[href*="${rule.value}"]`)
        linkDescendants.forEach(hideElement)
      } else if (rule.type === 'content') {
        const contentDescendants = node.querySelectorAll(rule.selector)
        contentDescendants.forEach(desc => {
          if (desc.textContent && desc.textContent.toLowerCase().includes(rule.value.toLowerCase())) {
            hideElement(desc)
          }
        })
      } else if (rule.type === 'title') {
        const titleDescendants = node.querySelectorAll(rule.selector)
        titleDescendants.forEach(desc => {
          if (desc.title && desc.title.toLowerCase().includes(rule.value.toLowerCase())) {
            hideElement(desc)
          }
        })
      } else if (rule.type === 'attribute') {
        const attrDescendants = node.querySelectorAll(`[${rule.attr}="${rule.value}"]`)
        attrDescendants.forEach(hideElement)
      }
    })
  }

  const hideAllElements = () => {
    hideRules.forEach(applyHideRule)
  }

  // Hide on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideAllElements)
  } else {
    hideAllElements()
  }

  // Observe for new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            hideElementsInNode(node)
          }
        })
      }
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
})()
