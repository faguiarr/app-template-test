import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import Home from "./home";

const Pages = () => {
    return (
        <Router hook={useHashLocation}>
            <Switch>
                <Route path="/" component={Home}></Route>
            </Switch>
        </Router>
    );
}

export default Pages;