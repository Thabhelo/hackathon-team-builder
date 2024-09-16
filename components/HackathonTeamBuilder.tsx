'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, User } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

type Participant = {
  name: string
  skillLevel: string
  team: number | null
}

const HackathonTeamBuilder = () => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [name, setName] = useState('')
  const [skillLevel, setSkillLevel] = useState('Beginner')
  const [teams, setTeams] = useState<Participant[][]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const savedParticipants = localStorage.getItem('participants')
    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants))
    }
    const adminState = localStorage.getItem('isAdmin')
    setIsAdmin(adminState === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('participants', JSON.stringify(participants))
  }, [participants])

  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin))
  }, [isAdmin])

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !skillLevel) return

    // Check for duplicate participants
    const exists = participants.some((p) => p.name === name)
    if (exists) {
      alert('Participant already exists!')
      return
    }

    setParticipants([...participants, { name, skillLevel, team: null }])
    setName('')
  }

  const formTeams = () => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random())
    const newTeams: Participant[][] = []
    for (let i = 0; i < shuffled.length; i += 4) {
      newTeams.push(shuffled.slice(i, i + 4))
    }
    setTeams(newTeams)
    setParticipants(shuffled.map((p, i) => ({ ...p, team: Math.floor(i / 4) + 1 })))
  }

  const toggleAdmin = () => {
    const newAdminState = !isAdmin
    setIsAdmin(newAdminState)
    localStorage.setItem('isAdmin', String(newAdminState))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6 text-teal-800">ColorStack Hackathon Team Builder</h1>
      
      <Alert className="mb-6 bg-yellow-100 border-yellow-200 text-yellow-900">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Share this link with your ColorStack members to join the team formation!
        </AlertDescription>
      </Alert>

      <form onSubmit={addParticipant} className="mb-6 space-y-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border-gray-300 focus:border-teal-500"
        />
        <Select value={skillLevel} onValueChange={setSkillLevel}>
          <SelectTrigger className="w-full border-gray-300 focus:border-teal-500">
            <SelectValue placeholder="Select your skill level" />
          </SelectTrigger>
          <SelectContent>
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">Join</Button>
      </form>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-800">Participants</h2>
        <ul className="space-y-2">
          {participants.map((p, i) => (
            <li key={i} className="flex items-center p-2 bg-gray-100 border border-gray-200 rounded-lg shadow">
              <User className="mr-2 text-teal-600" />
              <span className="font-medium">{p.name}</span>
              <span className="mx-2">-</span>
              <span className="text-indigo-600">{p.skillLevel}</span>
              {p.team && <span className="ml-auto text-teal-700">Team {p.team}</span>}
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <Button onClick={formTeams} className="w-full mb-6 bg-indigo-600 hover:bg-indigo-700 text-white">
          Form Teams
        </Button>
      )}

      {teams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-teal-800">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">Team {i + 1}</h3>
                <ul className="space-y-2">
                  {team.map((member, j) => (
                    <li key={j} className="flex items-center">
                      <User className="mr-2 text-teal-600" />
                      <span className="font-medium">{member.name}</span>
                      <span className="mx-2">-</span>
                      <span className="text-indigo-600">{member.skillLevel}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={toggleAdmin} className="mt-6 bg-gray-300 text-gray-800 hover:bg-gray-400">
        {isAdmin ? 'Disable Admin' : 'Enable Admin'}
      </Button>
    </div>
  )
}

export default HackathonTeamBuilder
