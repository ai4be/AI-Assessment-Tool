import React, { useState, useEffect, FC, Fragment } from 'react'
import {
  Box,
  Divider,
  Text,
  BoxProps,
  Grid,
  GridItem,
  Select,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Card, DisplayQuestion, Question } from '@/src/types/card'
import { Category, Project } from '@/src/types/project'
import { fetcher } from '@/util/api'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'
import { isEmpty } from '@/util/index'
import { setQuestionCleanTitle } from '@/util/question'
import { useQueryCardId } from '@/src/hooks/index'
import CardDetailsModal from '@/src/components/project/modals/card-details-modal'

type Props = {
  project: Project
  categories: Category[]
} & BoxProps

const CategoryQuestions: FC<Props> = ({ project, categories, ...boxProps }): JSX.Element => {
  const router = useRouter()
  const projectId = String(project?._id)
  const {
    [QueryFilterKeys.CATEGORY]: categoryId
  } = router.query
  const { data: dataCards } = useSWR(`/api/projects/${projectId}/cards`, fetcher)
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories)
  const [categoriesToShow, setToShowCategories] = useState<Category[]>(categories)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { card, setCardQuery, unSetCardQuery } = useQueryCardId(dataCards, () => onOpen(), () => onClose())

  useEffect(() => {
    if (Array.isArray(categories) && categoryId != null) {
      const localCategories = categoryId == null
        ? categories
        : categories.filter((category: Category) => category._id === categoryId)
      setFilteredCategories(localCategories)
    }
  }, [categories, categoryId])

  useEffect(() => {
    if (Array.isArray(filteredCategories) && Array.isArray(dataCards)) {
      dataCards.forEach(c => c.questions.map(q => setQuestionCleanTitle(q)))
      const catToShow: Category[] = []
      for (const cat of filteredCategories) {
        if (isEmpty(cat.sections)) {
          cat.sections = [{
            _id: 'default',
            id: 'default',
            title: '',
            cards: dataCards.filter((card: Card) => card.category === cat._id)
          }]
        } else {
          for (const section of cat.sections) {
            section.cards = dataCards.filter((card: Card) => card.category === cat._id && card.section === section.id)
          }
        }
        catToShow.push(cat)
      }
      setToShowCategories(catToShow)
    }
  }, [filteredCategories, dataCards])

  return (
    <Box backgroundColor='white' {...boxProps}>
      {categoriesToShow.map(category =>
        <Fragment key={category._id}>
          <Text fontSize='xl' textTransform='uppercase' fontWeight='semibold' marginBottom='1rem'>{category?.name}</Text>
          <Box display='flex' flexDirection='column'>
            {category.sections?.map((section, idx) =>
              <Grid templateColumns='min-content auto 8rem' key={`${category._id}-${section.id ?? idx}`} _last={{ marginBottom: '1rem' }} alignItems='center'>
                {!isEmpty(section.title) && <GridItem colSpan={3} marginTop={idx !== 0 ? '1rem' : '0'}><Text textTransform='uppercase' color='var(--main-blue)' marginBottom='1rem' marginLeft='1rem'>{section.title}</Text></GridItem>}
                {section.cards?.map((c, idxc) => c.questions.filter((q: Question) => q.isScored).map((q: Question, idxq) =>
                  <Fragment key={q.id}>
                    {(idxq !== 0 || idxc !== 0) && <><GridItem colSpan={1} height='3rem' justifySelf='center' paddingY='0.5rem'><Divider orientation='vertical' height='100%' color='#9f9e9f' /></GridItem><GridItem colSpan={2} /></>}
                    <GridItem colSpan={1}>
                      <Box height='2rem' width='2rem' borderRadius='full' backgroundColor='var(--main-light-blue)' />
                    </GridItem>
                    <GridItem colSpan={1} paddingLeft='1rem' onClick={() => setCardQuery(c._id, q.id)} cursor='pointer'>
                      <Text fontWeight='semibold' fontSize='sm' cursor='pointer'>{(q as DisplayQuestion).cleanTitle}</Text>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Select fontSize='xs' placeholder='-' value={Array.isArray(q.responses) ? q.responses[0] : ''}>
                        {q.answers.map((a, idxa) => <option key={idxa} value={idxa}>{a}</option>)}
                      </Select>
                    </GridItem>
                  </Fragment>
                ))}
              </Grid>)}
          </Box>
        </Fragment>)}
      {card != null && <CardDetailsModal isOpen={isOpen} onClose={unSetCardQuery} card={card} />}
    </Box>
  )
}

export default CategoryQuestions