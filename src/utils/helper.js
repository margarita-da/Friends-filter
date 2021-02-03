import renderFn from "../../friends-content.hbs"

// рендерим список друзей
export function rendering(renderZone, array, isLeft = true) {
  const html = renderFn({ items: array, left: isLeft })
  const friendsClass = document.querySelector(renderZone)
  friendsClass.innerHTML = html
}

export function getFriend(target, array) {
  const friend = target.closest("div[data-id]")
  const friendId = Number(friend.dataset.id)
  return array.filter((item) => item.id === friendId)
}

export function moving(from, to, newArray) {
  to.unshift(newArray[0])
  from = from.filter((item) => {
    console.log(newArray[0].id)
    item.id !== newArray[0].id
  })
}
