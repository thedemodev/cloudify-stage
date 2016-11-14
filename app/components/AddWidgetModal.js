/**
 * Created by kinneretzin on 08/09/2016.
 */

/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class AddWidgetModal extends Component {
    static propTypes = {
        plugins: PropTypes.array.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onPluginInstalled: PropTypes.func.isRequired
    };

    addWidget(widget) {
        this.props.onWidgetAdded(widget);
        $('.addWidgetModal').modal('hide');
    }

    constructor(props,context){
        super(props, context);

        this.state = {
            filteredPlugins: props.filteredPlugins || props.plugins
        };
    }

    render() {
        return (
            <div className="ui modal addWidgetModal">
                <div className="ui segment basic large">
                    <div className="ui icon input fluid mini">
                        <i className="search icon"></i>
                        <input type="text" placeholder="Search widgets ..." onChange={(e)=>this.setState({filteredPlugins: this.props.plugins.filter(function (el) {
                                                                                                                                                       return el.name.toLowerCase().includes(e.target.value.toLowerCase() || '')})})}/>
                    </div>

                    <div className="ui divider"></div>

                    <div className="ui items divided widgetsList">
                        {
                            this.state.filteredPlugins.map(function(widget){
                                return (
                                    <div className="item" key={widget.name}>
                                        <div className='ui image small bordered'>
                                            <img src={'/plugins/'+widget.id+'/widget.png'}/>
                                        </div>
                                        <div className="content">
                                            <a className="header">{widget.name}</a>
                                            <div className="meta">
                                                <span>{widget.description}</span>
                                            </div>
                                            <div className="description">
                                            </div>
                                            <div className="extra">
                                                <div className="ui right floated secondary button small" onClick={this.addWidget.bind(this,widget)}>
                                                    Add
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },this)
                        }
                    </div>

                    <button className="fluid ui button">Install new widget</button>
                </div>
            </div>
        );
    }
}
