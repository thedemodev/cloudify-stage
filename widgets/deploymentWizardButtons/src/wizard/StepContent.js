/**
 * StepContent component is interface for components implementing step content for {@link WizardModal}
 */
export default class StepContent extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * @property {string} id step ID
     * @property {Function} onChange function calling wizard to update data
     * @property {Function} onError function setting wizard in error state
     * @property {Function} onLoading function setting wizard in loading state
     * @property {Function} onReady function setting wizard in ready state
     * @property {object} stepData step data object
     * @property {object} wizardData wizard data object
     * @property {object} errors errors object
     * @property {object} toolbox Toolbox object
     */
    static propTypes = {
        id: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onLoading: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        stepData: PropTypes.object.isRequired,
        wizardData: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    render() {
        const { children } = this.props;
        return children || null;
    }
}
