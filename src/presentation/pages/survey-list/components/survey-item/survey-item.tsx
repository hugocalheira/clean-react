import React from 'react'
import { SurveyModel } from '@/domain/models'
import { Icon, IconName } from '@/presentation/components'
import Styles from './survey-item-styles.scss'

type Props = {
  survey: SurveyModel
}

const SurveyItem: React.FC<Props> = ({ survey }: Props) => {
  const { question, date } = survey
  const iconName = survey.didAnswer ? IconName.thumbUp : IconName.thumbDown
  return (
    <li className={Styles.surveyItemWrap}>
        <div className={Styles.surveyContent}>
            <Icon iconName={iconName} className={Styles.iconWrap} />
            <time>
                <span data-testid='day' className={Styles.day}>
                  {date.getDate().toString().padStart(2, '0')}
                </span>
                <span data-testid='month' className={Styles.month}>
                  {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}
                </span>
                <span data-testid='year' className={Styles.year}>
                  {date.getFullYear()}
                </span>
            </time>
            <p data-testid='question'>{question}</p>
        </div>
        <footer>Ver Resultado</footer>
    </li>
  )
}

export default SurveyItem
