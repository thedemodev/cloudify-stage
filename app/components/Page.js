/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
//import InlineEdit from 'react-edit-inline';

import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';
import Breadcrumbs from './Breadcrumbs';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired,
        pagesList: PropTypes.array.isRequired,
        onPageNameChange: PropTypes.func.isRequired,
        onPageDescriptionChange: PropTypes.func.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired
        }

    render() {
        return (
            <div className="">
                <Breadcrumbs pagesList={this.props.pagesList} onPageNameChange={this.props.onPageNameChange} onPageDescriptionChange={this.props.onPageDescriptionChange} isEditMode={this.props.isEditMode} onPageSelected={this.props.onPageSelected} onPageRemoved={this.props.onPageRemoved}/>
                {/*
                 <h3 className='ui header dividing'>
                    <InlineEdit
                        text={this.props.page.name}
                        change={data=>this.props.onPageNameChange(this.props.page.id,data.name)}
                        paramName="name"
                        />
                </h3>
                 */}
                 {
                    this.props.isEditMode ?
                    <AddWidget pageId={this.props.page.id}/>
                    :
                    ''
                 }

                <div className='ui divider'/>

                <WidgetsList widgets={this.props.page.widgets} pageId={this.props.page.id}
                             onWidgetsGridDataChange={this.props.onWidgetsGridDataChange}
                             isEditMode={this.props.isEditMode || false}
                             />

                {/* Modal is here so it will exist one time in the page. we dont need it for each edit button*/}
            </div>
        );

    }
}
