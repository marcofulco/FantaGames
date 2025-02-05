<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: X-Requested-With, origin, content-type');
if(isset($_POST['jSonRichiesta'])==false)
{
    echo "Errore: richiesta non valida";
    die();
}
    $request=$_POST['jSonRichiesta'];
    $request=json_decode($request);
    global $error;
    if(isset($request->azione)==false)
    {
        $error.="Errore: azione non valida".json_encode($request);
        $res=false;
        goto fine;
    }

    $azione=$request->azione;
    $categoria=$request->categoria;
    switch($azione){
        case 'caricaDati':
            require_once('caricaDati.php');
            $caricaDati=new caricaDati();
            $dati=$request->dati;
            $dati=str_replace('^','&', json_encode($dati));
            $dati=json_decode($dati);
            $res=$caricaDati->carica($dati,$categoria);
            break;
        case 'leggiDati':
            require_once('leggiDati.php');
            $leggiDati=new leggiDati();
            $classifica=$request->classifica;
            $res=$leggiDati->leggi($categoria,$classifica);
            break;
    }
    fine:
    echo elaboraRisposta($res);
    function elaboraRisposta($res){
        $risposta=[];
        global $error;
        if($res==false){
            $risposta['esito']=false;
        }
        else{
            $risposta['esito']=true;
            if(is_array($res)){
                $risposta['dati']=$res;
            }
            else{
                $risposta['dati']=[];
            }
        }
        if($error==null){
            $error='';
        }
        $risposta['error']=$error;
        return json_encode($risposta);
    }
?>