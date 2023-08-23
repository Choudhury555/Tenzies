import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import "./App.css"

export default function App() {
    
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies,setTenzies]=React.useState(false)
    const [roll,setRoll]=React.useState(0)
    const[bestScore,setbestScore]=React.useState(JSON.parse(localStorage.getItem("bestScore")) || 0)
    ///// .everey() method returns true , if every item in that array returns true(for some conditions) 
    React.useEffect(() => {
        const allHeld=dice.every(die => die.isHeld === true)
        // if all die.isHeld are true then dice.every() will return true
        // if one of die.isHeld is false then dice.every() will return false
        const firstValue=dice[0].value
        const allSameValue=dice.every(die => die.value===firstValue)
        //we are picking the first value and compare with all the other value if all are same then it will return true else return false
        if(allHeld && allSameValue){
            console.log("You Won")
            setTenzies(true)
            setRecord()
        }
    },[dice])
    
    function generateNewDie(){
        return {
                value:Math.ceil(Math.random() * 6),
                isHeld:false,
                id:nanoid()
            }
    }
    
    
    function setRecord(){
        if(!bestScore || roll<bestScore){
            setbestScore(roll)
        }
    }
    
    React.useEffect(() => {
        localStorage.setItem("bestScore" , JSON.stringify(bestScore))
    },[bestScore])
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())//calling the generateNewDie() to push newly created dice
        }
        return newDice
    }
    
    function rollDice() {
        if(tenzies===false){
            setDice(prevDice => {
                return prevDice.map(die => {
                    return die.isHeld ? die : generateNewDie()
                })
            })
        setRoll(prevroll => prevroll+1)
        }else{
            setDice(allNewDice())
            setRoll(0)
            setTenzies(false)
        }
    }
    
    
    
    const diceElements = dice.map(die =>    {
     return  <Die 
                value={die.value} 
                key={die.id} 
                isHeld={die.isHeld}
                handleClick={holdDice}
                id={die.id}
            />
    })
    
    
    function holdDice(id){
        setDice(prevDice => {
            return prevDice.map(die => {
                return die.id===id ? {...die , isHeld:!die.isHeld} : die
            })
        })
    }
    
    
    
    return (
        <div className="center">
            <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <h2 className="highscore">Best Score(Rolls) : {bestScore}</h2>
                <h3 className="roll">No. of Rolls : {roll}</h3>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
            </main>
        </div>
    )
}