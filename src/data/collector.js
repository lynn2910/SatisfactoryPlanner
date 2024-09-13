class Collector {
  constructor() {
  }

  async loadData() {
    let r = await fetch('/src/data/data.json')
      .catch(
        (e) => {
          console.error(e)
          alert('Cannot fetch: ' + e.message)
        }
      )

    let j = await r.json().catch(
      (e) => {
        console.error(e)
        alert('Invalid JSON: ' + e.message)
      }
    )

    this.data = j
    console.log('Database loaded')
  }

  getRecipe(id) {
    return this.data.recipes[id]
  }

  getItem(id) {
    return this.data.items[id]
  }

  getResources(id) {
    return this.data.resources[id]
  }

  getBuilding(id) {
    return this.data.buildings[id]
  }

  getMiner(id) {
    return this.data.buildings[id]
  }
}

export const collector = new Collector()

/**
 * Buildings size
 *
 * The values are expressed as units in-game. Therefore,
 * 1u = a foundation
 *
 * @type {{[k as string]: {width: number, length: number, height: number}}}
 */
export const buildingSize = {
  'Desc_SmelterMk1_C': {
    width: 1,
    length: 1.2,
    height: 10
  }
}