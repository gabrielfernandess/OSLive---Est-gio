
angular.module("oslive", ['ngAnimate'])

.controller('homeController', function($scope){

var time;
var pc, cpu;
$scope.processos = [];
$scope.processoAtual = null;

//info é o valor da primeira posição do select "Selecione o Algoritmo de escalonamento"
$scope.escalonador = "info"

$scope.cadastrar = function(processo){
	processo.nome = processo.nome.toUpperCase();
	if(!$scope.processo.edit){
		if(!verificaID($scope.processo.nome)){
			if($scope.processo.chegada != null){
				if($scope.processo.execucao != null){
					var p = angular.copy(processo);
					p.cor = gera_cor();
					$scope.processos.push(p);
					$scope.limparForm();

					$(".glyphicon-cog").notify("Processo cadastrado!", "success");	
					
				}
				else{
					$(".glyphicon-cog").notify("Processo sem T. Execução!", "error");
				}
			}
			else{
				$(".glyphicon-cog").notify("Processo sem T. Chegada", "error");	
			}	
		} else{
			$(".glyphicon-cog").notify("Processo já existe!", "error");
		}
	}	
	else {
		//busca o objeto na lista de processos e atualiza os daods do processo
		$scope.processos.forEach(function(process, i){
			if(process.nome === $scope.processo.nome) {
				process.chegada = $scope.processo.chegada;
				process.execucao = $scope.processo.execucao;
				process.prioridade = $scope.processo.prioridade;
			}
		});
		$scope.processo = null;
	}
}

$scope.limparForm = function(){
	$scope.processo.nome="";
	$scope.processo.chegada="";
	$scope.processo.execucao=null;
	$scope.processo.prioridade=null;
}

// função para exibição do tooltip
$(document).ready(function(){
    $('[data-toggle=tooltip]').hover(function(){
		// on mouseenter
		$(this).tooltip('show');
    }, function(){
		// on mouseleave
        $(this).tooltip('hide');
    });
});

// app.directive('tooltip', function(){
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs){
//             element.hover(function(){
//                 // on mouseenter
//                 element.tooltip('show');
//             }, function(){
//                 // on mouseleave
//                 element.tooltip('hide');
//             });
//         }
//     };
// });

$scope.limparListProcessos = function(){
	var processosSize = $scope.processos.length;
	for (var i = 0; i < processosSize; i ++) {
		$scope.processos.shift();
	}
}

//TENTAR O FOCUS COM ISSO

// //verifica se o nome foi preenchido
// var nome = document.getElementById("nome");
// var valorNome = nome.value;
// if(valorNome.length < 6 || valorNome.length >= 35){
// 	erro += " - O campo precisar possuir entre 6 e 35 caracteres! \n";
// 	nome.style.background = "red";
// 	nome.focus();
// }

$scope.geradorAleatorio = function(){
	$scope.limparListProcessos();
	listNomes = ["A", "B", "C", "D"];
	for (var i = 0; i < 4; i++) {
		$scope.processo.nome = listNomes[i];

		if (i == 0) $scope.processo.chegada = 0;
		else $scope.processo.chegada = Math.round(Math.random() * 10);
													
		$scope.processo.execucao = Math.round(Math.random() * 7) + 1;
		$scope.processo.prioridade = Math.round(Math.random() * 1);
		$scope.processo.cor = gera_cor();
		var processoFinalizado = angular.copy($scope.processo);
		$scope.processos.push(processoFinalizado);
	}
	$scope.quantum = Math.round(Math.random() * 2) + 1;
	$scope.limparForm();
}

// cria fila de aptos
$scope.aptos = function(list) {
	var aux, count = null;
	$scope.filaAptos = [];
	$scope.filaDelay = [];
	list.forEach(function(processo, i){
		if (i != 0) count ++;
		if (processo.nome != aux && processo.nome != "-") {
			aux = processo.nome;
			p = angular.copy(processo);
			p.count = count;
			$scope.filaAptos.push(p);
			$scope.filaDelay.push(count);
		}
	});
}

//animação da fila de aptos
// $scope.animacaoFilaApto = function(processo){
// 	console.log('processoAtual = ' + $scope.processoAtual);
// 	$scope.processoAtual = processo.nome;
// 	console.log('processoAtual = ' + $scope.processoAtual);
// 	for(var i=0; i< $scope.filaAptos.length; i++){
// 		if ($scope.filaAptos[i].nome == processo.nome && $scope.filaAptos[i].cor != '#e8e5e5') {
// 			$scope.filaAptos[i].cor = '#e8e5e5';
// 			break;
// 		}
// 	}
// 	console.log('animação fila de aptos' + processo.nome);
// }

$scope.cancel_simulacao = function(){
	window.location.reload();
}
$scope.excluir = function(index){
	$scope.processos.splice(index, 1);
};

//cria-se uma copia do objeto a ser editado e seta a copia no scope.processo
$scope.editar = function(processo){
	$scope.aleatorio = false;
	var copia = angular.copy(processo);
	$scope.processo = copia;
	$scope.processo.edit = true;
}

$scope.simular = function(){
var algoritmo = $scope.escalonador;
$scope.resultados;
$scope.resultados2;
$scope.mediaEspera;
$scope.mediaTurn;

var quantum = $scope.quantum;

	var lista = validar();
	pc = new PC (lista);
	cpu = new CPU ();

	if(algoritmo!=null && algoritmo!="info"){
		if(lista.length != 0){
			
			if(algoritmo == "FIFO"){
				$scope.resultados = simulandoFIFO();
				$scope.resultados2 = pc.tabelaResultado();
				drawChart($scope.resultados2);
				$.notify("Escalonamento FIFO!", "success");
			}

			if(algoritmo == "SJF"){
				$scope.resultados = simulandoSJF();
				$scope.resultados2 = pc.tabelaResultado();
				drawChart($scope.resultados2);
				$.notify("Escalonamento SJF!", "success");	
			}

			if(algoritmo == "PrioNP"){
				if(validarPrio(lista)){
					$scope.resultados = simulandoPrio();
					$scope.resultados2 = pc.tabelaResultado();
					drawChart($scope.resultados2);
					$.notify("Escalonamento Prioridade Não Preemptiva!", "success");
				}
				else
				$(".glyphicon-cog").notify("Informe a prioridade do(s) Processo(s)!", {
				position:"right" });
			}
			if(algoritmo == "PrioP"){
				if(validarPrio(lista)){
					 $scope.resultados = simulandoPrioPremp();
					 $scope.resultados2 = pc.tabelaResultado();
					 drawChart($scope.resultados2);
					$.notify("Escalonamento Prioridade Preemptiva!", "success");
				}
				else
				$(".glyphicon-cog").notify("Informe a prioridade do(s) Processo(s)!", {
				position:"right" });
			}

			if(algoritmo == "RR"){
				if(!quantum == 0 || !quantum == null){
					$scope.resultados = simulandoRR(quantum);
					$scope.resultados2 = pc.tabelaResultado();
					drawChart($scope.resultados2);
					$.notify("Escalonamento Round Robin!", "success");
				}
				else{
					$(".glyphicon-cog").notify("Informe o Quantun!", {
						position:"right" });
				}
			}
		}
		else{
			$(".glyphicon-cog").notify("Adicione os Processos!", {
				position:"right" });
		}

	} 
	else{
		$(".glyphicon-cog").notify("Selecione o algoritmo!", {
			position:"right" });
	}
	$scope.aptos($scope.resultados);
}


function simulandoFIFO(){
	var escalonar = new FIFO(); 
	var resultado = []; 
	var status = new Array();
	var aux;

	time =0;  

	while(!pc.vazio() || !escalonar.vazio() || cpu.ocupado){   
		aux = pc.processosPorTempo(time);
		
		while(aux.length >0){
			escalonar.addProcesso(aux.shift()); 
		}

		if(!cpu.ocupado && !escalonar.vazio()){  
			cpu.alocaProcesso(escalonar.escolherProcesso());
		}

		if(cpu.ocupado){ 
			aux = cpu.act();
			if(!cpu.ocupado)  
				pc.addfinalizado(aux); 
		}
		else
			aux = null;

		escalonar.addTEspera(1);  

		if(aux != null) 
			resultado.push({nome:aux.nome, cor: aux.cor});
		else 
			resultado.push({nome:"-", cor: "#FFFFFF"}); 

		time++;
	}

	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}
	return status;
}

function simulandoSJF(){
	var escalonar = new SJF();
	var resultado = [];
	var aux;
	var status = new Array();

	time=0;
	while(!pc.vazio() || !escalonar.vazio() || cpu.ocupado){
		aux = pc.processosPorTempo(time);

		while(aux.length >0){
			escalonar.addProcesso(aux.shift());
		}

		if(!cpu.ocupado && !escalonar.vazio()){
			cpu.alocaProcesso(escalonar.escolherProcesso());
		}

		if(cpu.ocupado){
			aux = cpu.act();
			if(!cpu.ocupado)
				pc.addfinalizado(aux);
		}
		else
			aux = null;

		escalonar.addTEspera();

		if(aux != null)
			resultado.push({nome:aux.nome, cor: aux.cor});
		else
			resultado.push({nome:"-", cor: "#FFFFFF"});

		time++;

	}
	
	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}

	return status;
}

function simulandoPrio(){
	var escalonar = new Prioridade();
	var resultado = [];
	var aux;
	var status = new Array();

	time=0;
	while(!pc.vazio() || !escalonar.vazio() || cpu.ocupado){
		aux = pc.processosPorTempo(time);

		while(aux.length >0){
			escalonar.addProcesso(aux.shift());
		}

		if(!cpu.ocupado && !escalonar.vazio()){
			cpu.alocaProcesso(escalonar.escolherProcesso());
		}

		if(cpu.ocupado){
			aux = cpu.act();
			if(!cpu.ocupado)
				pc.addfinalizado(aux);
		}
		else
			aux = null;

		escalonar.addTEspera();

		if(aux != null)
			resultado.push({nome:aux.nome, cor: aux.cor});
		else
			resultado.push({nome:"-", cor: "#FFFFFF"});

		time++;

	}
	
	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}

	return status;
}

function simulandoPrioPremp(){
	var escalonar = new PrioridadePreemp();
	var troca = 0;
	var resultado = [];
	var aux;
	var chaveamento;
	var status = new Array();

	time=0;
	chaveamento=0;

	while (!pc.vazio() || !escalonar.vazio() || cpu.ocupado)
	    {   
	        aux = pc.processosPorTempo(time);

	        while (aux.length > 0)
	            escalonar.addProcesso( aux.shift() );

	        if (chaveamento > 0)
	        {
	        	resultado.push({nome:"-", cor: "#FFFFFF"});
	            escalonar.addTEspera(1);
	            time ++;
	            chaveamento --;
	            continue;
	        }

	        if(!escalonar.vazio()){
	        	if(!cpu.ocupado){
	        		cpu.alocaProcesso(escalonar.escolherProcesso());
	        	}
	        	else if(escalonar.topo().prioridade < cpu.processo.prioridade){
	        		aux = cpu.retiraProcesso();
	        		escalonar.addProcesso(aux);
	        		chaveamento = troca;
	        		continue;
	        	}
	        }


	        if (cpu.ocupado)
	        {
	            aux = cpu.act();
	            if (!cpu.ocupado)
	            {
	                pc.addfinalizado(aux);
	                chaveamento = troca;
	            }
	        }
	        else
	            aux = null;
	            
	        escalonar.addTEspera(1);
	        
	        if (aux != null)
	            resultado.push({nome:aux.nome, cor: aux.cor});
	        else
	            resultado.push({nome:"-", cor: "#FFFFFF"});
	        
	        time++;
	     
	    }

	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}
	return status;
}

function simulandoRR(q){
	var escalonar = new FIFO();
	var quantun = q;
	var troca = 0;
	var resultado = [];
	var aux,tmp;
	var chaveamento;
	var status = new Array();

	tmp =0;
	time=0;
	chaveamento=0;

	while (!pc.vazio() || !escalonar.vazio() || cpu.ocupado)
	    {   
	        aux = pc.processosPorTempo(time);

	        while (aux.length > 0)
	            escalonar.addProcesso( aux.shift() );

	        if (chaveamento > 0)
	        {
	            aux = cpu.retiraProcesso();
	            escalonar.addProcesso(aux);
	            chaveamento = 0;
	        }

	        if (tmp == 0 && !escalonar.vazio())
	            cpu.alocaProcesso(escalonar.escolherProcesso());

	        if (cpu.ocupado)
	        {
	            tmp++;
	            aux = cpu.act();
	            if (!cpu.ocupado)
	            {
	                pc.addfinalizado(aux);
	                tmp = 0;
	            }
	        }
	        else
	            aux = null;
	            
	        escalonar.addTEspera(1);
	        
	        if (aux != null)
	            resultado.push({nome:aux.nome, cor: aux.cor});
	        else
	            resultado.push({nome:"-", cor: "#FFFFFF"});
	        
	        time++;
	        
	        if (tmp == quantun)
	        {
	            tmp = 0;
	            chaveamento = 1;
	        }
	    }

	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}
	return status;
}

function validar(){		//verifica se o primeiro processo inicializa com zero
	var pro = new Array();

	for(var i=0; i< $scope.processos.length; i++){
		if($scope.processos[0].chegada != 0 || $scope.processos[0].chegada == null){
			$.notify("O PRIMEIRO processo inicializa O TEMPO DE CHEGADA com 0.", "error");
			break;
		}
		else{
			var cor = gera_cor();
			pro.push(new Processo($scope.processos[i].nome, $scope.processos[i].chegada, $scope.processos[i].execucao, $scope.processos[i].prioridade, $scope.processos[i].cor));
		}
	}
	return pro;
}


function validarPrio(lista){		//verifica se o campo prioridade dos processos estão preenchidos
	var pro = new Array();
	var cont=0;	
	for(var i=0; i< lista.length; i++){
		if(lista[i].prioridade != null){
			cont++;
		}
	}
	if(cont == lista.length){
		return true;
	}
	return false;
}

function verificaID(nome){			// Verifica se o processo já existe
	for(var i=0; i< $scope.processos.length; i++){
		if($scope.processos[i].nome == nome){
			return true;
		}
	}
	return false;
}

function gera_cor(){		// gera cor aleatoria
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';
    // Pega um número aleatório no array acima
    for (var i = 0; i < 6; i++ ) {
    //E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}

});
