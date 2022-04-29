import { Container } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Nav from './components/nav';
import { MediaProvider } from './contexts/mediaContext';
import { WebsocketProvider } from './contexts/websocketContext';
import Home from './views/home';
import Login from './views/login';
import Logout from './views/logout';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: 64,
    textAlign: 'center',
    width: '100vw',
    [theme.breakpoints.down(600)]: {
      paddingTop: 56,
    },
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <MediaProvider>
        <WebsocketProvider>
          <Container
            maxWidth="xl"
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            <Nav />
            <main className={classes.content}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
              </Switch>
            </main>

          </Container>
        </WebsocketProvider>
      </MediaProvider>
    </Router >

  );
}

export default App;
