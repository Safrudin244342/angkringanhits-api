const Respon = require('../Config/Respon')
const RedisDB = require('../Config/RedisDB')
const Model = require('../Model/History')
const Verifikasi = require('../Helper/Verifikasi')
const History = {}

History.all = async (req, res) => {
  try {
    const data = await Model.getAll()
    data.map(value => {
      let newDate = String(value.date).split(' ')
      newDate = `${newDate[2]} ${newDate[1]} ${newDate[3]}`
      value.date = newDate
    })

    RedisDB.client.setex(`history${req.url}`, 60, JSON.stringify(data))

    return Respon(req, res, {code: 200, values: data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the get all function'), error:true})
  }
}

History.add = async (req, res) => {
  try {
    const { cashier, orders, amount } = req.body

    if (!Verifikasi.input(cashier, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid cashier, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(orders, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid order, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(amount, 'number')) return Respon(req, res, {code: 200, errMsg:"invalid amount, it must be a number and contain no symbol(', <, >)", error:true})

    await Model.add(cashier, orders, amount)

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the add function'), error:true})
  }
}

History.update = async (req, res) => {
  try {
    const id = req.params.id
    const { cashier, orders, amount } = req.body

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 200, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(cashier, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid cashier, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(orders, 'string')) return Respon(req, res, {code: 200, errMsg:"invalid order, it must be a string and contain no symbol(', <, >)", error:true})
    if (!Verifikasi.input(amount, 'number')) return Respon(req, res, {code: 200, errMsg:"invalid amount, it must be a number and contain no symbol(', <, >)", error:true})

    const result = await Model.update(id, cashier, orders, amount)

    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`history with id ${id} not found`, error:true})

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the update function'), error:true})
  }
}

History.delete = async (req, res) => {
  try {
    const id = req.params.id

    if (!Verifikasi.input(id, 'number')) return Respon(req, res, {code: 200, errMsg:"invalid id, it must be a number and contain no symbol(', <, >)", error:true})

    const result = await Model.delete(id)

    if (result.rowCount === 0) return Respon(req, res, {code: 200, errMsg:`history with id ${id} not found`, error:true})

    return Respon(req, res, {code: 200, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the delete function'), error:true})
  }
}

History.report = async (req, res) => {
  try {
    let today = await Model.report('0 DAYS', '1 DAYS', 'sum')
    today = parseInt(today[0].sum || 0)

    let yesterday = await Model.report('1 DAYS', '2 DAYS', 'sum')
    yesterday = parseInt(yesterday[0].sum || 0)

    let weekOrder = await Model.report('0 WEEKS', '1 WEEKS', 'count')
    weekOrder = parseInt(weekOrder[0].count || 0)

    let lastWeekOrder = await Model.report('1 WEEKS', '2 WEEKS', 'count')
    lastWeekOrder = parseInt(lastWeekOrder[0].count || 0)

    let year = await Model.report('0 YEARS', '1 YEARS', 'sum')
    year = parseInt(year[0].sum || 0)
    
    let lastYear = await Model.report('1 YEARS', '2 YEARS', 'sum')
    lastYear = parseInt(lastYear[0].sum || 0)

    const report = {
      today: {
        amount: today,
        enhancement: yesterday === 0 ? 100:Math.round(((today - yesterday) / yesterday) * 100)
      },
      order: {
        amount: weekOrder,
        enhancement: lastWeekOrder === 0 ? 100:Math.round(((weekOrder - lastWeekOrder) / lastWeekOrder) * 100)
      },
      year: {
        amount: year,
        enhancement: lastYear === 0 ? 100:Math.round(((year - lastYear) / lastYear) * 100)
      }
    }

    RedisDB.client.setex(`history${req.url}`, 60, JSON.stringify(report))

    return Respon(req, res, {code: 200, values:report, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the report function'), error:true})
  }
}

History.getFor = async (req, res) => {
  try {
    const state = req.params.state

    const data = await Model.getFor(state)
    data.map(value => {
      let newDate = String(value.date).split(' ')
      newDate = `${newDate[2]} ${newDate[1]} ${newDate[3]}`
      value.date = newDate
    })

    RedisDB.client.setex(`history${req.url}`, 60, JSON.stringify(data))

    return Respon(req, res, {code: 200, values:data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the getfor function'), error:true})
  }
}

History.allReport = async (req, res) => {
  try {
    const state = req.params.state

    const nowStart = state === 'week' ? '0 WEEKS':'0 MONTHS'
    const nowEnd = state == 'week' ? '1 WEEKS':'1 MONTHS'
    const now = await Model.allReport(nowStart, nowEnd)

    const lastStart = state === 'week' ? '1 WEEKS':'1 MONTHS'
    const lastEnd = state == 'week' ? '2 WEEKS':'2 MONTHS'
    const last = await Model.allReport(lastStart, lastEnd)

    const nowAmount = now.map(value => (parseInt(value.amount) || 0))
    const lastAmount = last.map(value => (parseInt(value.amount) || 0))
    const nowId = Array.from(Array(nowAmount.length).keys())
    const lastId = Array.from(Array(nowAmount.length).keys())

    const data = {
      now: {
        id: nowId.reverse(),
        amount: nowAmount.reverse()
      },
      last: {
        id: lastId.reverse(),
        amount: lastAmount.reverse()
      }
    }

    RedisDB.client.setex(`history${req.url}`, 60, JSON.stringify(data))

    return Respon(req, res, {code: 200, values:data, success:true})
  } catch (error) {
    return Respon(req, res, {code: 500, errMsg:(error.message || 'Something wrong in the allReport function'), error:true})

  }
}

module.exports = History
