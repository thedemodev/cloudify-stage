/**
 * Created by jakub.niezgoda on 29/10/2018.
 */

export default class ErrorCausesModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        onClick: PropTypes.func,
        show: PropTypes.bool
    };

    static defaultProps = {
        onClick: _.noop,
        show: false
    };

    render() {
        const { onClick, show } = this.props;
        const { Icon, Popup } = Stage.Basic;

        return show ? (
            <Popup on="hover">
                <Popup.Trigger>
                    <Icon.Group
                        size="big"
                        onClick={e => {
                            e.stopPropagation();
                            onClick();
                        }}
                    >
                        <Icon name="file text" color="red" />
                        <Icon corner name="zoom" color="black" />
                    </Icon.Group>
                </Popup.Trigger>
                <Popup.Content>Show Error Causes</Popup.Content>
            </Popup>
        ) : null;
    }
}
