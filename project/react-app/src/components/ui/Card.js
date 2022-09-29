import classes from "./Card.module.css";

const Card = (props) => {
  // this is a wrapper for our components
  return <div className={classes.card}>{props.children}</div>;
};

export default Card;
