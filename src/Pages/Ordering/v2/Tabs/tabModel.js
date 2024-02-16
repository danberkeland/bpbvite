

const cartTab = {
  index: 0, 
  label: 'Cart Orders', 
  icon: 'pi pi-fw pi-shopping-cart'
}
const standingTab = {
  index: 1, 
  label: 'Standing Orders', 
  icon: 'pi pi-fw pi-calendar'
}
const retailTab = {
  index: 2, 
  label: 'Retail', 
  icon: 
  'pi pi-fw pi-shopping-cart'
}
const helpTab = {
  index: 3, 
  label: 'Help', 
  icon: 'pi pi-fw pi-question-circle'
}

const standingBlacklist = ['high', 'hios', 'sandos']

const buildTabModel = (authClass, locNick) => {
  let tabModel = [cartTab]
  if (authClass === 'bpbfull' || !standingBlacklist.includes(locNick)) {
    tabModel.push(standingTab)
  }
  if (authClass === 'bpbfull') tabModel.push(retailTab)
  tabModel.push(helpTab)
 
  return tabModel
}

export {
  buildTabModel
}