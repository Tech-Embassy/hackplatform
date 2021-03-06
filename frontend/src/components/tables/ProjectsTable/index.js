import React, { useMemo, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as OrganiserSelectors from 'redux/organiser/selectors'

import { Table, Filters, Sorters } from 'components/generic/_Table'
import JobRoleInput from 'components/inputs/JobRoleInput'
import { push } from 'connected-react-router'
import { useLocation } from 'react-router-dom'
import EditProjectModal from 'components/modals/EditProjectModal'

const ProjectsTable = ({ projects }) => {
    const teams = useSelector(OrganiserSelectors.teams)
    const dispatch = useDispatch()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const query = new URLSearchParams(location.search)
    const hasModal = query.has('modal')
    const activeModal = query.get('modal')

    const [selectedProject, setSelectedProject] = useState(null)
    // TODO config columsn (table only in physical events)
    const openSingleEdit = useCallback(row => {
        setSelectedProject(row.original)
        /* const search = `?${new URLSearchParams({
                modal: 'edit',
                id: row.original.user,
            }).toString()}`
            dispatch(push({ search })) */
    }, [])

    const columns = useMemo(() => {
        return [
            {
                Header: '#',
                accessor: (row, index) => {
                    return index + 1
                },
                id: 'index',
                sortType: Sorters.Numeric,
            },
            {
                Header: 'Team',
                accessor: 'teamCode',
                ...Filters.ContainsSearch,
            },
            {
                Header: 'Name',
                accessor: 'name',
                ...Filters.ContainsSearch,
            },
            {
                Header: 'Punchline',
                accessor: 'punchline',
                ...Filters.ContainsSearch,
            },
            /*
            {
                Header: 'Location',
                accessor: 'location',
                ...Filters.ContainsSearch,
            },
            */
        ]
    }, [])
    // TODO refactor forloops
    const data = projects.map(project => {
        for (const i in teams) {
            const team = teams[i]
            if (project.team === team._id) {
                project.teamCode = team.code
                break
            }
        }
        return project
    })
    return (
        <>
            <EditProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
            <Table data={data} columns={columns} onRowClick={openSingleEdit} />
        </>
    )
}

export default ProjectsTable
