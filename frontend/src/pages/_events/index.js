import React from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { useRouteMatch } from 'react-router'

import EventDetailRouter from './:slug/'

export default () => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.url}/:slug`} component={EventDetailRouter} />
            {/** TODO: Consider adding a generic list of events at /events */}
            <Redirect to="/" />
        </Switch>
    )
}
