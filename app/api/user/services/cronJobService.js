const UserStats = require('../../../models/userStats')
const UserStreams = require('../../../models/universityTrending')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const scheduler = require('node-schedule')

class CronJobService {
  async cleanUserStatsScheduler () {
    try {
      console.log('CronJobService called')
      // const crontab = '0 0 1 * *' // first of every month at midnight.
      // const crontab = '0 0 1 */3 *' // At 00:00 on day-of-month 1 in every 3rd month.
      const crontab = '0 0 * * 0' // At 00:00 on Sunday.
      scheduler.scheduleJob(crontab, async () => {
        await this.cleanUserStats()
      })
    } catch (err) {
      console.log(err)
    }
  }

  async cleanStreamingStatsScheduler () {
    try {
      console.log('CronJobService called')
      // const crontab = '0 0 1 * *' // first of every month at midnight
      // const crontab = '0 0 1 */3 *' // At 00:00 on day-of-month 1 in every 3rd month.
      const crontab = '0 0 * * 0' // At 00:00 on Sunday.
      scheduler.scheduleJob(crontab, async () => {
        await this.cleanStreamingStats()
      })
    } catch (err) {
      console.log(err)
    }
  }

  async cleanUserStats () {
    console.log('cleanUserStats called')
    const deletedUserLogs = await UserStats.destroy({
      where: {
        date: {
          [Op.lt]: moment().utc().subtract(1, 'month').format('YYYY-MM-DD')
        }
      }
    })
    console.log(deletedUserLogs)
    return deletedUserLogs
  }

  async cleanStreamingStats () {
    console.log('cleanUserStats called')
    const deletedUserLogs = await UserStreams.destroy({
      where: {
        created_at: {
          [Op.lt]: moment().utc().subtract(1, 'month').format('YYYY-MM-DD')
        }
      }
    })
    console.log(deletedUserLogs)
    return deletedUserLogs
  }
}

module.exports = CronJobService
