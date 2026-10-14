import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function reading(reducedMotion=false) {
  const source=readFileSync(new URL('../js/game.js',import.meta.url),'utf8');
  const part=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
  const button={hidden:true,textContent:''};
  let tasks=[];
  const context=vm.createContext({
    window:{matchMedia:()=>({matches:reducedMotion})},
    document:{hidden:false,querySelector:()=>({id:'tela-dialogo'}),getElementById:id=>id==='botao-leitura'?button:{hidden:true}},
    estado:{clienteAtual:{},atendimentoExpulso:false},
    jogoPausado:false,elementoDigitacao:null,concluirDigitacaoAtual:null,
    proximaAcaoLeitura:null,temporizadorDigitacao:null,
    personalizarTexto:text=>text,
    agendarAcao:(fn,ms)=>{const task={fn,ms};tasks.push(task);return task;},
    cancelarAcao:task=>{tasks=tasks.filter(t=>t!==task);},
    sincronizarTempoAtendimento:()=>{}
  });
  vm.runInContext(part('function deveContarTempoAtendimento()','function sincronizarTempoAtendimento()')+
    part('function cancelarDigitacao()','function framesAndandoAtuais()'),context);
  const element={textContent:'',scrollTop:0,scrollHeight:500,closest:()=>null,classList:{add(){},remove(){}}};
  return {context,button,element,flush:()=>{while(tasks.length)tasks.shift().fn();},pending:()=>tasks.length};
}

test('a completed message remains visible until confirmed, without consuming decision time or advancing twice',()=>{
  const {context:c,button,element,flush,pending}=reading();
  let advanced=0;
  assert.equal(c.deveContarTempoAtendimento(),true);
  c.digitarTexto(element,'Mensagem longa para ler com calma.',()=>c.aguardarLeitura(()=>advanced++));
  assert.equal(c.deveContarTempoAtendimento(),false);
  flush();
  assert.equal(pending(),0);
  assert.equal(advanced,0);
  assert.equal(element.textContent,'Mensagem longa para ler com calma.');
  assert.equal(element.scrollTop,0);
  assert.match(button.textContent,/Continuar/);
  assert.equal(c.deveContarTempoAtendimento(),false);
  assert.equal(c.avancarLeitura(),true);
  assert.equal(advanced,1);
  assert.equal(c.avancarLeitura(),false);
  assert.equal(advanced,1);
  assert.equal(c.deveContarTempoAtendimento(),true);
});

test('completing the animation does not skip its reading confirmation; pause blocks both actions',()=>{
  const {context:c,element,pending}=reading();
  let advanced=0;
  c.digitarTexto(element,'Uma fala inteira.',()=>c.aguardarLeitura(()=>advanced++));
  c.jogoPausado=true;
  assert.equal(c.avancarLeitura(),false);
  c.jogoPausado=false;
  assert.equal(c.avancarLeitura(),true);
  assert.equal(element.textContent,'Uma fala inteira.');
  assert.equal(pending(),0);
  assert.equal(advanced,0);
  c.jogoPausado=true;
  assert.equal(c.avancarLeitura(),false);
  c.jogoPausado=false;
  c.avancarLeitura();
  assert.equal(advanced,1);
});

test('reduced motion still requires reading confirmation, and leaving the scene cancels the pending action',()=>{
  const {context:c,button,element}=reading(true);
  let advanced=0;
  c.digitarTexto(element,'Sem animação.',()=>c.aguardarLeitura(()=>advanced++));
  assert.equal(element.textContent,'Sem animação.');
  assert.equal(advanced,0);
  c.cancelarDigitacao();
  assert.equal(button.hidden,true);
  assert.equal(c.avancarLeitura(),false);
  assert.equal(advanced,0);
});
