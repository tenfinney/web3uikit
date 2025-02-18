import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Loading } from '../Loading';
import {
    DivStyled,
    DivStyledContent,
    DivStyledHelper,
    FooterStyled,
    ListItemStyled,
    NavStyled,
    OrderedListStyled,
    SectionStyled,
    SpanStyled,
} from './Stepper.styles';
import { H2Styled } from '../../styles/StyledElements';
import color from '../../styles/colors';
import { StepperProps } from './types';

const Stepper: React.FC<StepperProps> = ({
    step = 0,
    stepData,
    hasNavButtons = true,
    helperContent,
    completeTitle = 'all done, nice!',
    completeMessage = 'You should tell the user what to do next, or use the onComplete function to programmatically fire an event',
    onComplete,
}) => {
    const [activeStep, setActiveStep] = useState(step);
    const myStepRef = useRef(activeStep);

    useEffect(() => {
        // subscribe event
        document.addEventListener('prev', prevStep);
        document.addEventListener('next', nextStep);
        return () => {
            // unsubscribe event
            document.removeEventListener('prev', prevStep);
            document.removeEventListener('next', nextStep);
        };
    }, []);

    useEffect(() => {
        if (activeStep === Number(stepData.length + 1)) {
            onComplete && onComplete();
            return;
        }
    }, [activeStep]);

    const setStep = (data: number) => {
        myStepRef.current = data;
        setActiveStep(data);
    };

    const prevStep = () => {
        if (myStepRef.current <= 1) return;
        setStep(myStepRef.current - 1);
    };

    const nextStep = () => {
        setStep(myStepRef.current + 1);
    };

    const handleContentClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as Element;
        if (!target.id) return;
        if (target.id === 'prev') prevStep();
        if (target.id === 'next') nextStep();
        return;
    };

    const renderPreloader = () => (
        <DivStyled>
            <H2Styled data-testid="test-stepper_title">
                Just one sec...
            </H2Styled>
            <Loading size={20} spinnerColor={color.green} />
        </DivStyled>
    );

    const renderContent = () => (
        <DivStyled>
            <H2Styled data-testid="test-stepper_title">
                {activeStep <= stepData.length
                    ? stepData[Number(activeStep - 1)].title || ''
                    : completeTitle}
            </H2Styled>
            <DivStyledContent
                onClick={handleContentClick}
                data-testid="test-stepper_content"
            >
                {activeStep <= stepData.length
                    ? stepData[Number(activeStep - 1)].content
                    : completeMessage}
            </DivStyledContent>
        </DivStyled>
    );

    const renderStepperNumbers = () => (
        <OrderedListStyled data-testid="test-stepper_numbers">
            {stepData.map((step, index) => (
                <Fragment key={`step_${index}`}>
                    <ListItemStyled
                        activeStep={activeStep}
                        aria-label={`step ${Number(index + 1)} ${step.title}`}
                        stepTotal={stepData.length}
                        thisStep={Number(index + 1)}
                    >
                        {activeStep <= Number(index + 1) ? (
                            Number(index + 1)
                        ) : (
                            <Icon svg="check" fill={color.green} />
                        )}
                    </ListItemStyled>

                    <SpanStyled
                        activeStep={activeStep}
                        stepTotal={stepData.length}
                        thisStep={Number(index + 1)}
                        aria-hidden="true"
                    />
                </Fragment>
            ))}
        </OrderedListStyled>
    );

    return (
        <SectionStyled data-testid="test-stepper">
            <header>{renderStepperNumbers()}</header>

            {activeStep === 0 ? renderPreloader() : renderContent()}

            <FooterStyled>
                {hasNavButtons && (
                    <NavStyled data-testid="test-stepper_nav">
                        <Button
                            disabled={activeStep === 0}
                            onClick={prevStep}
                            text="Prev"
                            theme="secondary"
                            type="button"
                        />
                        <Button
                            disabled={activeStep === 0}
                            onClick={nextStep}
                            text={
                                activeStep === stepData.length + 1
                                    ? 'Done!'
                                    : 'Next'
                            }
                            theme="primary"
                            type="button"
                        />
                    </NavStyled>
                )}

                {helperContent && (
                    <DivStyledHelper data-testid="test-stepper_helper">
                        {helperContent}
                    </DivStyledHelper>
                )}
            </FooterStyled>
        </SectionStyled>
    );
};

export default Stepper;
