import { withRouter } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import useForm from '../hooks/formHooks';
import { useUsers } from '../hooks/apiHooks';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    loginHeader: {
        [theme.breakpoints.down(600)]: {
            fontSize: '2rem'
        },
    },
    loginButton: {
        backgroundColor: '#5F4B8BFF',
        marginTop: '2rem',
        marginBottom: '0.5rem',
        '&:hover': {
            backgroundColor: '#7159a6',
        },
    }
}));

interface propType {
    history: {
        push: Function,
    }
}

const LoginForm = ({ history }: propType) => {
    const classes = useStyles();
    const { postLogin } = useUsers();
    const doLogin = async () => {
        try {
            const userdata = await postLogin(inputs);
            if(userdata!.success) {
                localStorage.setItem('token', userdata?.data.token);
                history.push('/');
            } else {
                alert('The username or password is incorrect');
            }
        } catch (e) {
            console.log('doLogin', e.message);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, {
        username: '',
        password: '',
    });

    return (
        <Grid container>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Typography className={classes.loginHeader} component="h3" variant="h3" gutterBottom>
                    Login
                </Typography>
            </Grid>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <form onSubmit={handleSubmit}>
                    <Grid container direction="column">
                        <Grid container item>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                onChange={handleInputChange}
                                value={inputs.username}
                            />
                        </Grid>
                        <Grid container item>
                            <TextField
                                type="password"
                                name="password"
                                label="Password"
                                onChange={handleInputChange}
                                value={inputs.password}
                            />
                        </Grid>

                        <Grid container item>
                            <Button
                                fullWidth
                                className={classes.loginButton}
                                color="primary"
                                type="submit"
                                variant="contained"
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};


export default withRouter(LoginForm);