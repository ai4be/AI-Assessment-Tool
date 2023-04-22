import React, { FC, useEffect, useState } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import ChecklistTopBar from '@/src/components/project/checklist/top-bar'
import { Project, Category, Section } from '@/src/types/project'
import CategoryQuestions from '@/src/components/project/checklist/category-questions'
import OverviewComponent from '@/src/components/project/checklist/overview'
import RadarChart from '@/src/components/project/checklist/radar-chart'
import { fetcher } from '@/util/api'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'
import { isEmpty } from '@/util/index'
import { setQuestionCleanTitle } from '@/util/question'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Card, Question } from '@/src/types/card'
import { useTranslation } from 'next-i18next'

interface Props {
  project: Project
  categories: Category[]
  sections: Section[]
}

const isSectionCard = (card: Card, cat: Category, sec?: Section): boolean => {
  let val = card.category === cat._id && card.questions.some(q => q.isScored) // show only scored questions
  if (sec != null) val = val && card.section === sec.id
  return val
}

const PLACEHOLDER_SECTION_ID = 'placeholder-section-id'

const Checklist: FC<Props> = ({ project, categories, sections }): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const projectId = String(project?._id)
  const {
    [QueryFilterKeys.CATEGORY]: categoryId
  } = router.query
  const { data: dataCards } = useSWR(`/api/projects/${projectId}/cards`, fetcher)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories)
  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>(categories)

  useEffect(() => {
    if (Array.isArray(categoriesToShow)) {
      const localCategories = categoryId == null
        ? categoriesToShow
        : categoriesToShow.filter((category: Category) => category._id === categoryId)
      setFilteredCategories(localCategories)
      if (categoryId != null && localCategories.length === 0) {
        const query = { ...router.query }
        delete query[QueryFilterKeys.CATEGORY]
        void router.push({ query }, undefined, { shallow: true })
      }
    }
  }, [categoriesToShow, categoryId])

  useEffect(() => {
    if (Array.isArray(categories) && Array.isArray(dataCards)) {
      dataCards.forEach(c => c.questions.map((q: Question) => setQuestionCleanTitle(q)))
      const catToShow: Category[] = []
      for (const cat of categories) {
        if (isEmpty(cat.sections)) {
          cat.sections = [{
            _id: PLACEHOLDER_SECTION_ID,
            id: PLACEHOLDER_SECTION_ID,
            title: '',
            cards: dataCards.filter((card: Card) => isSectionCard(card, cat))
          }]
        } else {
          for (const section of cat.sections) {
            if (section._id === PLACEHOLDER_SECTION_ID) section.cards = dataCards.filter((card: Card) => isSectionCard(card, cat))
            else section.cards = dataCards.filter((card: Card) => isSectionCard(card, cat, section))
          }
        }
        const cards = cat.sections.map(s => s.cards).flatMap(c => c ?? [])
        if (cards.length > 0) catToShow.push(cat)
      }
      setCategoriesToShow(catToShow)
    }
  }, [categories, dataCards])

  return (
    <Box backgroundColor='white' padding='2rem' paddingTop='1rem' borderRadius='1rem' className='print:p-0'>
      <Flex justifyContent='flex-end' className='print:hidden'>
        <Button backgroundColor='#2811ED' color='white' onClick={() => window?.print()}>{t('buttons:export')}</Button>
      </Flex>
      <Text color='#1C1E20' fontSize='18px' className='hidden print:block'>1. Overview</Text>
      <OverviewComponent categories={categoriesToShow} />
      <Text color='#1C1E20' fontSize='18px' className='hidden print:block' marginTop='1rem'>2. Assessment</Text>
      <RadarChart categories={categoriesToShow} />
      <ChecklistTopBar categories={categoriesToShow} />
      <Box className='hidden print:block break-before-page' />
      <CategoryQuestions project={project} categories={filteredCategories} marginTop='1rem' cards={dataCards} />
    </Box>
  )
}

export default Checklist
