import React, { useEffect, useState } from "react";
import { getWeb3, getContract } from "./web3";
import './App.css';

function VotingApp() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3Instance = await getWeb3();
      const accountsList = await web3Instance.eth.getAccounts();
      const contractInstance = await getContract(web3Instance);
      try {
        const candidatesList = await contractInstance.methods.getCandidates().call();
        setCandidates(candidatesList);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }

      setWeb3(web3Instance);
      setAccounts(accountsList);
      setContract(contractInstance);
    };

    init();
  }, []);

  const handleVote = async (candidateId) => {
    try{
      await contract.methods.vote(candidateId).send({ from: accounts[0] });
      alert("Vote casted!");
    } catch(error){
      if (error.message.includes("You have already voted")) {
        alert("You have already voted. Duplicate voting is not allowed.");
      } else if (error.message.includes("Invalid candidate")) {
        alert("Invalid candidate. Please select a valid candidate.");
      }else {
        alert(`Error: ${error.message}`);
      }
    }
    window.location.reload();
  };

  return (
    <>
      <h1 className="title">Decentralized Voting Application</h1>
      <div className="table-container">
              <div className="table-header">
                <span>S.No.</span>
                <span>Name</span>
                <span>Vote Count</span>
                <span>Vote</span>
              </div>
              <div className="scrollable-list">
                {candidates.map((candidate, index) => (
                  <div className="list-item">
                    <span className='can'>{index + 1}</span>
                    <span className='can'>{candidate.name}</span>
                    <span className='can'>{parseInt(candidate.voteCount,10)}</span>
                    <span><button onClick={() => handleVote(candidate.id)} className="vote">Vote</button></span>
                  </div>
                ))}
              </div>
        </div>
    </>
  );
}

export default VotingApp;
