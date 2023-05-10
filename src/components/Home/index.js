import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    activeId: categoriesList[0].id,
    projectsList: [],
    appStatus: status.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({appStatus: status.loading})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const fetchingData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      this.setState({projectsList: fetchingData, appStatus: status.success})
    } else {
      this.setState({appStatus: status.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeId: event.target.value}, this.getProjectList)
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectList}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="project-list-container">
        {projectsList.map(eachItem => (
          <ProjectItem key={eachItem.id} projectDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="courses-details-loader">
      <Loader type="ThreeDots" color="#4656a1" height="50" width="50" />
    </div>
  )

  renderProjectsListView = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case status.loading:
        return this.renderLoadingView()
      case status.success:
        return this.renderSuccessView()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <nav className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="category-list-container">
          <select className="category-list" onChange={this.onChangeCategory}>
            {categoriesList.map(eachCategory => (
              <option
                key={eachCategory.id}
                value={eachCategory.id}
                className="each-category"
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsListView()}
        </div>
      </div>
    )
  }
}

export default Home
