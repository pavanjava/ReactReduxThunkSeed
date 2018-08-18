import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import DishDetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {connect} from 'react-redux';
import {
    postComment,
    fetchDishes,
    fetchComments,
    fetchPromos,
    fetchLeaders,
    postFeedback
} from "../redux/ActionCreators";
import {actions} from 'react-redux-form';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const mapStateToProps = (state) => {

    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

const mapDispatchToProps = (dispatch) => ({
    addComment: (dishId, rating, author, commont) => dispatch(postComment(dishId, rating, author, commont)),
    fetchDishes: () => {
        dispatch(fetchDishes())
    },
    resetFeedbackForm: () => {
        dispatch(actions.reset('feedback'))
    },
    fetchComments: () => {
        dispatch(fetchComments())
    },
    fetchPromos: () => {
        dispatch(fetchPromos())
    },
    postComment: (dishId, rating, author, comment) => {
        dispatch(postComment(dishId, rating, author, comment))
    },
    fetchLeaders: () => {
        dispatch(fetchLeaders())
    },
    postFeedback: (firstname,lastname,telnum,email,agree,contactType,message) => {
        return dispatch(postFeedback(firstname,lastname,telnum,email,agree,contactType,message));
    },
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render() {
        const DishWithId = ({match}) => {
            return (
                <DishDetail
                    dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => {
                        return comment.dishId === parseInt(match.params.dishId, 10)
                    })}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                />
            );
        }

        const HomePage = () => {
            return (
                <Home dish={this.props.dishes.dishes.filter((dish) => {
                    return dish.featured === true
                })[0]}
                      dishesLoading={this.props.dishes.isLoading}
                      dishesErrMess={this.props.dishes.errMess}
                      promotion={this.props.promotions.promotions.filter((promotion) => promotion.featured === true)[0]}
                      promosLoading={this.props.promotions.isLoading}
                      promosErrMess={this.props.promotions.errMess}
                      leader={this.props.leaders.leaders.filter((leader) => leader.featured === true)[0]}
                      leadersLoading={this.props.leaders.isLoading}
                      leadersErrMess={this.props.leaders.errMess}/>
            );
        }

        const RenderAbout = () => {
            return (
                <About leaders={this.props.leaders.leaders}/>
            );
        }

        return (
            <div>
                <Header/>
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames={'page'} timeout={'300'}>
                        <Switch>
                            <Route path={"/home"} component={HomePage}/>
                            <Route exact path={"/menu"} component={() => <Menu dishes={this.props.dishes}/>}/>
                            <Route path={"/menu/:dishId"} component={DishWithId}/>
                            <Route exact path={"/contactus"}
                                   component={() => <Contact resetFeedBackForm={this.props.resetFeedbackForm}
                                                             postFeedback={this.props.postFeedback}/>}/>
                            <Route exact path={"/aboutus"} component={RenderAbout}/>
                            <Redirect to={"/home"}/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
