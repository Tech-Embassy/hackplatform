const Event = require('../event/model')
const Project = require('../project/model')
const { ProjectScore } = require('./model')
const { NotFoundError } = require('../../common/errors/errors')

const controller = {}

controller.addProjectScore = async score => {
    await Project.findById(score.project).orFail(
        new NotFoundError('The given project does not exist.')
    )
    await Event.findById(score.event).orFail(
        new NotFoundError('The given event does not exist.')
    )

    const projectScore = new ProjectScore({ ...score })
    return projectScore.save()
}

controller.updateProjectScore = async (id, updatedProjectScore) => {
    const projectScore = await ProjectScore.findById(id).orFail(
        new NotFoundError('The given ProjectScore does not exist.')
    )

    projectScore.score = updatedProjectScore.score
    projectScore.max_score = updatedProjectScore.max_score
    projectScore.message = updatedProjectScore.message
    projectScore.status = updatedProjectScore.status

    await projectScore.save()
    return projectScore
}

controller.getScoresByEventAndTeamId = (eventId, teamId) => {
    return ProjectScore.find({ event: eventId })
        .populate({
            path: 'project',
            match: { team: teamId },
            select: '_id',
        })
        .populate({
            path: 'event',
        })
        .then(results => results.filter(doc => doc.project !== null))
}

controller.getScoreByProjectId = projectId => {
    return ProjectScore.findOne({ project: projectId })
}

controller.getPublicScores = async eventId => {
    return ProjectScore.find({ event: eventId })
        .populate({ path: 'event', select: 'name' })
        .populate({ path: 'project', select: 'name track challenges' })
}

module.exports = controller
