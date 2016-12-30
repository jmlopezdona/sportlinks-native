import React, {Component} from 'react'
import {connect} from 'react-redux'
import {showSelectedAction, fetchShowsAction} from './reducers/shows'
import dateFormat from 'dateformat'
import {View, Text, ListView, TouchableOpacity, StyleSheet, RefreshControl} from 'react-native'
import {navigateTo} from '../../reducers/navigation'
import {Container, Header, Title, Content, Button, Icon} from 'native-base'
import myTheme from '../../themes/base-theme'
import {openDrawer} from '../../reducers/drawer'

class ShowsList extends Component {
  constructor(props) {
    super(props)
  }

  _onRefresh() {
    this.props.refreshShowList()
  }

  renderIcon = (sport) => {
    switch (sport.toUpperCase()) {
      case 'SOCCER':
        return <Icon name="ios-football" style={styles.litleSportIcon} />
      case 'BASKETBALL':
        return <Icon name="ios-basketball" style={styles.litleSportIcon} />
      case 'TENNIS':
        return <Icon name="ios-tennisball" style={styles.litleSportIcon} />
      case 'FOOTBALL':
        return <Icon name="ios-american-football" style={styles.litleSportIcon} />
      default:
        return <Icon name="ios-videocam" style={styles.litleSportIcon} />
    }
  }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    return (
      <TouchableOpacity key={rowID}
        onPress={this.props.handleShowSelected(rowData)}>
        <View style={{flex: 1, flexDirection: 'row', paddingTop: 8}} >
          {this.renderIcon(rowData.sport)}
          <View style={{flex: 1, paddingLeft: 10, paddingBottom: 9}} >
            <Text style={styles.titleText}>{rowData.event}</Text>
            <Text style={styles.baseText}>{rowData.date} {rowData.hour} - {rowData.competition}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return (
      <Container theme={myTheme} style={styles.container}>

        <Header>
          <Title>Sporting Shows</Title>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name="ios-menu" />
          </Button>
        </Header>

          <View style={{flex: 1, paddingTop: 0, paddingLeft: 10, marginRight: 10}}>
            <ListView
              dataSource={ds.cloneWithRows(this.props.shows)}
              keyboardShouldPersistTaps={true}
              renderRow={this.renderRow}
              enableEmptySections={true}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.loading}
                  onRefresh={this._onRefresh.bind(this)}
                  colors={['blue', 'green', 'red']}
                />
              }
            />
          </View>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  baseText: {
    fontSize: 13,
  },
  litleSportIcon: {
    color: '#000000',
    paddingTop: 2,
    fontSize: 34,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})

function mapStateToProps(state) {
  let receivedAt = state.shows.receivedAt
  return {
    sourceId: state.shows.sourceId,
    shows: state.shows.list,
    loading: state.shows.loading,
    receivedAt: (receivedAt!==undefined) ? dateFormat(receivedAt, "HH:MM:ss") : undefined
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleShowSelected: (showDescription) => () => {
      dispatch(showSelectedAction(showDescription))
      dispatch(navigateTo('showDetail', 'home'))
    },
    openDrawer: () => dispatch(openDrawer()),
    refreshShowList: () => dispatch(fetchShowsAction('1')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowsList)
