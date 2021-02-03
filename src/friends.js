import "./style/style.scss"

import { auth, callAPI } from "./api/api"
import { rendering, getFriend, moving } from "./utils/helper"

VK.init({
  apiId: 7736818,
})

const leftZone = document.querySelector(".friends-left")
const rightZone = document.querySelector(".friends-right")

let arrayRight = [],
  arrayLeft = [],
  searchArrayL,
  searchArrayR

auth()
  .then(() => {
    return callAPI("friends.get", {
      fields: "last_name, first_name, photo_100",
    })
  })
  .then((friends) => {
    addHtml(friends)
  })

function addHtml(friends) {
  function filterL() {
    if (leftInput.value.length > 0) {
      value = leftInput.value.toLowerCase()
      searchArrayL = arrayLeft.filter((item) => {
        if (
          item.first_name.toLowerCase().includes(value) ||
          item.last_name.toLowerCase().includes(value)
        ) {
          return item
        }
      })
      rendering(".friends-left", searchArrayL)
    } else {
      rendering(".friends-left", arrayLeft)
    }
  }
  function filterR() {
    if (rightInput.value.length > 0) {
      value = rightInput.value.toLowerCase()
      searchArrayR = arrayRight.filter((item) => {
        if (
          item.first_name.toLowerCase().includes(value) ||
          item.last_name.toLowerCase().includes(value)
        ) {
          return item
        }
      })
      rendering(".friends-right", searchArrayR, false)
    } else {
      rendering(".friends-right", arrayRight, false)
    }
  }

  arrayLeft = friends.items
  rendering(".friends-left", arrayLeft)

  document.addEventListener("click", (e) => {
    // клик на плюсики из левой части

    if (e.target.classList.contains("plus")) {
      let newArray = getFriend(e.target, arrayLeft)
      moving(arrayLeft, arrayRight, newArray)
      //   arrayRight.unshift(newArray[0])
      //   arrayLeft = arrayLeft.filter((item) => item.id !== newArray[0].id)
    }
    if (e.target.classList.contains("delete")) {
      let newArray = getFriend(e.target, arrayRight)
      arrayRight = arrayRight.filter((item) => item.id !== newArray[0].id) //удаляем при клике на крестик из правой части
      arrayLeft.unshift(newArray[0]) // добавление удаленных друзей из правой части в левую
    }
    filterL()
    filterR()
  })

  makeDnd([leftZone, rightZone])

  function makeDnd(zones) {
    let currentDrag

    zones.forEach((zone) => {
      zone.addEventListener("dragstart", (e) => {
        currentDrag = { source: zone, node: e.target }
      })

      zone.addEventListener("dragover", (e) => {
        e.preventDefault()
      })

      zone.addEventListener("drop", (e) => {
        if (currentDrag) {
          e.preventDefault()
          if (currentDrag.source !== zone) {
            if (currentDrag.node.classList.contains("friend")) {
              if (zone.classList.contains("friends-right")) {
                let newArray = getFriend(currentDrag.node, arrayLeft)
                arrayRight.unshift(newArray[0])
                arrayLeft = arrayLeft.filter(
                  (item) => item.id !== newArray[0].id
                )
              } else if (zone.classList.contains("friends-left")) {
                let newArray = getFriend(currentDrag.node, arrayRight)

                arrayRight = arrayRight.filter(
                  (item) => item.id !== newArray[0].id
                )
                arrayLeft.unshift(newArray[0])
              }
              filterL()
              filterR()
            } else {
              zone.insertBefore(currentDrag.node, zone.lastElementChild)
            }
          }

          currentDrag = null
        }
      })
    })
  }

  let leftInput = document.querySelector(".search-left__input"),
    rightInput = document.querySelector(".search-right__input"),
    value

  leftInput.addEventListener("keyup", filterL)
  rightInput.addEventListener("keyup", filterR)
}

// function filter(array, where, altArray, value) {
//   if (value.length > 0) {
//     value = value.toLowerCase()
//     array = array.filter((item) => {
//       if (
//         item.first_name.toLowerCase().includes(value) ||
//         item.last_name.toLowerCase().includes(value)
//       ) {
//         return item
//       }
//     })
//     rendering(where, array)
//   } else {
//     rendering(where, altArray)
//   }
// }
