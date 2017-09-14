import React from 'react'
import {gql, graphql} from 'react-apollo'
import {assocPath, reduce} from 'ramda'
import {List, ListItem} from 'material-ui/List';
import CodeIcon from 'material-ui/svg-icons/action/code'
import StarIcon from 'material-ui/svg-icons/toggle/star-border'
import ForkIcon from 'material-ui/svg-icons/hardware/device-hub'
import WatchIcon from 'material-ui/svg-icons/image/remove-red-eye'
import Avatar from 'material-ui/Avatar'
import CircularProgress from 'material-ui/CircularProgress';

function renderStat(stat, type, statName, icon) {
    console.log('rendering', stat, type, statName, icon)
    if (stat !== undefined) {
        return <ListItem 
            key={`${type}.${statName}`}
            primaryText={statName}
            secondaryText={stat.toString()}
            leftAvatar={<Avatar>{icon}</Avatar>}
        
        />
    }
    return null;
}

function renderStats(stats) {
    if (stats && (stats.length > 0)) {
        const {repo} = reduce((p, c) => assocPath([
            c.type, c.name
        ], c.total, p), {}, stats)
        console.log('stats', stats, 'repo', repo);
        return (
            <List>
                <ListItem 
                    primaryText='Repos'
                    secondaryText={repo.count.toString()}
                    leftAvatar={<Avatar><CodeIcon/></Avatar>}
                    initiallyOpen={true}
                    nestedItems={[
                        renderStat(repo.stars, 'repo', 'stars', <StarIcon/>),
                        renderStat(repo.forks, 'repo', 'forks', <ForkIcon/>),
                        renderStat(repo.watching, 'repo', 'watching', <WatchIcon/>),
                    ]}
                />
            </List>
        )
    }
    return <p>Sorry, no stats yet</p>
}

function UserDetails(props) {
    const user = props.data.user;
    console.log('props:', props);
    if (user) {
        return (
            <div>
                <h1>{user.name}</h1>
                { renderStats(user.stats) }
            </div>
        );
    } else if (props.loading) {
        return <CircularProgress />
    } else if (props.error) {
        return <div>Sorry, an error ocurred while fetching data</div>
    } else {
        return <div>Sorry, we still don't have data for user {props.username}</div>
    }

}

export default graphql(gql `
query UserDetails($username: String!){
  user(username:$username) {
    id
    name
    username
    email
    accounts {
      sourceSystem
      accountName
    }
    stats {
      type
      name
      total
    }
  }
}`, {
    options: props => ({
        variables: {
            username: props.username
        }
    })
})(UserDetails);
